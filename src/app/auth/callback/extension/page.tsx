'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function ExtensionCallback() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.accessToken) {
      console.log('Attempting to send token to parent')
      // Send message to parent (the extension)
      if (window.opener) {
        window.opener.postMessage({
          type: 'AUTH_TOKEN',
          token: session.user.accessToken
        }, 'https://www.soraredata.com')
        
        // Close the window after sending the token
        setTimeout(() => {
          window.close()
        }, 1000)
      } else {
        // If opened directly, show the token
        document.body.innerHTML = 'Authentication successful. You can close this window.'
      }
    }
  }, [session])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Authenticating...</p>
    </div>
  )
} 