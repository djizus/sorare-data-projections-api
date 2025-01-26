import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      discordId?: string
      isAdmin?: boolean
      accessToken?: string
    }
  }

  interface Profile {
    id: string
    username: string
    avatar: string
  }
} 