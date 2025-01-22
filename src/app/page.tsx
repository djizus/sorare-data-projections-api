import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'
import Link from 'next/link'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Sorare Data Projections API</h1>
      <div className="space-y-4 text-center">
        {session ? (
          <div className="space-y-4">
            <p>Welcome, {session.user?.name}</p>
            <Link 
              href="/api/predictions" 
              className="text-blue-500 hover:underline block"
            >
              View Predictions
            </Link>
          </div>
        ) : (
          <Link 
            href="/auth/signin"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Sign In with Discord
          </Link>
        )}
      </div>
    </div>
  )
}
