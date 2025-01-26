import { SessionProvider } from '@/components/SessionProvider'
import './globals.css'
import type { Metadata } from 'next'
import AuthCallback from '@/components/AuthCallback'

export const metadata: Metadata = {
  title: 'Scrappo',
  description: 'Manage your Scrappo preferences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <SessionProvider>
          <AuthCallback />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 