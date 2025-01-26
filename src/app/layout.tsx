import { SessionProvider } from '@/components/SessionProvider'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sorare Data Projections API',
  description: 'Upload your Sorare Data projections',
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
          {children}
        </SessionProvider>
      </body>
    </html>
  )
} 