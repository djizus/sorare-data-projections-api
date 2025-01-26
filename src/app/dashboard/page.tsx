import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import PreferencesForm from '@/app/components/PreferencesForm'
import clientPromise from '@/lib/mongodb'

async function getLastUpdate() {
  const client = await clientPromise
  const db = client.db('ScrappoDB')
  
  const lastUpdate = await db.collection('lastUpdateData').findOne(
    { flag: "lineup_predictions" }
  )
  
  return lastUpdate?.date
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  const lastUpdateDate = await getLastUpdate()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={session.user.image}
                alt={session.user?.name || 'User avatar'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {session.user?.name}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-6">
        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          <PreferencesForm />
        </div>

        {/* Predictions Access & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Predictions API</h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Access the latest lineup predictions through our API endpoint:
              </p>
              <a 
                href="/api/predictions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Latest Predictions
              </a>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Last Update</h3>
            {lastUpdateDate ? (
              <div className="font-medium space-y-1">
                <div className="text-2xl">
                  {new Date(lastUpdateDate).toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {new Date(lastUpdateDate).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    timeZoneName: 'short'
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No updates available
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 