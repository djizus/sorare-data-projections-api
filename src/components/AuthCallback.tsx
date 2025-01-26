// src/app/components/AuthCallback.tsx
'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function AuthCallback() {
  const { data: session } = useSession()

  useEffect(() => {
    console.log('Session updated:', session?.user?.accessToken ? 'Token exists' : 'No token')
    
    if (session?.user?.accessToken) {
      console.log('Sending token to extension')
      try {
        window.postMessage({
          type: 'AUTH_TOKEN',
          token: session.user.accessToken
        }, 'https://www.soraredata.com')
        console.log('Token sent successfully')
      } catch (error) {
        console.error('Error sending token:', error)
      }
    }
  }, [session])

  return null
}