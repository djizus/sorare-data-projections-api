import { AuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import clientPromise from '@/lib/mongodb'

const scopes = ['identify', 'guilds'].join(' ')

interface DiscordGuild {
  id: string;
  name: string;
  permissions: string;
}

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {params: {scope: scopes}},
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`,
          discordId: profile.id,
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === 'discord') {
        try {
          const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          })
          
          const guilds = (await guildsResponse.json()) as DiscordGuild[]
          const isMember = guilds.some((guild) => guild.id === process.env.DISCORD_SERVER_ID)
          
          if (isMember) {
            const client = await clientPromise
            const db = client.db('ScrappoDB')
            
            const now = new Date()
            const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            
            await db.collection('users').findOneAndUpdate(
              { discordId: user.id },
              {
                $set: {
                  email: user.email,
                  name: user.name,
                  image: user.image,
                  discordId: user.id,
                  accessToken: account.access_token,
                  tokenCreatedAt: now,
                  tokenExpiresAt: expiresAt,
                  isActive: true,
                  updatedAt: now,
                },
                $setOnInsert: {
                  createdAt: now,
                }
              },
              { 
                upsert: true,
              }
            )

            // Send token to extension
            if (typeof window !== 'undefined') {
              window.postMessage({
                type: 'AUTH_TOKEN',
                token: account.access_token
              }, 'https://www.soraredata.com')
            }

            return true
          }
        } catch (error) {
          console.error('Discord authentication error:', error)
        }
      }
      return false
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = profile.id
      }
      return token
    },
    async session({ session, token }) {
      if (!token) return session

      try {
        const client = await clientPromise
        const db = client.db('ScrappoDB')
        
        console.log('Looking up user with Discord ID:', token.discordId)
        
        const user = await db.collection('users').findOne({ 
          discordId: token.discordId,
          isActive: true,
        })

        if (!user) {
          console.warn('User not found for Discord ID:', token.discordId)
          return session
        }

        // Add console.log to debug token
        console.log('Setting session with accessToken:', user.accessToken)

        return {
          ...session,
          user: {
            ...session.user,
            id: user._id.toString(),
            discordId: user.discordId,
            accessToken: user.accessToken,
          },
        }
      } catch (error) {
        console.error('Session error:', error)
        return session
      }
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} 