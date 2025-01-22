import NextAuth from 'next-auth'
import { AuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { mongoAdapter } from '@/lib/mongodb-adapter'

// Discord requires specific scope permissions
const scopes = ['identify', 'guilds'].join(' ')

export const authOptions: AuthOptions = {
  adapter: mongoAdapter,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {params: {scope: scopes}},
    }),
  ],
  callbacks: {
    async signIn({ account, profile }: any) {
      if (account.provider === 'discord') {
        // Fetch user's guilds using the access token
        const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
          headers: {
            Authorization: `Bearer ${account.access_token}`,
          },
        })
        
        const guilds = await guildsResponse.json()
        
        // Check if user is in your server
        // Replace YOUR_SERVER_ID with your Discord server ID
        const isInServer = guilds.some((guild: any) => guild.id === process.env.DISCORD_SERVER_ID)
        
        return isInServer
      }
      return false
    },
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token
        token.discordId = profile.id
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      session.discordId = token.discordId
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 