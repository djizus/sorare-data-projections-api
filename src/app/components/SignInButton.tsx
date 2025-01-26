'use client'

import { signIn } from 'next-auth/react'

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
    >
      Sign In with Discord
    </button>
  )
} 