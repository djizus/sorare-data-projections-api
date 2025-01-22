'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignIn() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  const handleSignIn = async () => {
    await signIn('discord', { callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold mb-8">Welcome</h1>
          <button
            onClick={handleSignIn}
            className="flex items-center gap-2 bg-[#5865F2] text-white px-6 py-3 rounded-md hover:bg-[#4752C4] transition-colors"
          >
            Sign in with Discord
          </button>
        </div>
      </div>
    )
  }

  return null
} 