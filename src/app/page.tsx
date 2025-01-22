import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import SignInButton from './components/SignInButton'

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
          <SignInButton />
        )}
      </div>
    </div>
  )
}
