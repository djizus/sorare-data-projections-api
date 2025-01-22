import { AuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { mongoAdapter } from '@/lib/mongodb-adapter'
import { Account, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

const scopes = ['identify', 'guilds'].join(' ')

interface DiscordGuild {
  id: string;
  name: string;
  permissions: string;
}

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
    async signIn({ account }) {
      if (account?.provider === 'discord') {
        const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
          headers: {
            Authorization: `Bearer ${account.access_token}`,
          },
        })
        
        const guilds = (await guildsResponse.json()) as DiscordGuild[]
        return guilds.some((guild) => guild.id === process.env.DISCORD_SERVER_ID)
      }
      return false
    },
    async jwt({ token, account, user }: { token: JWT; account: Account | null; user: User | null }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.discordId = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        accessToken: token.accessToken,
        discordId: token.discordId,
      }
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