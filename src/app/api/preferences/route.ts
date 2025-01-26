import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await clientPromise
    const db = client.db('ScrappoDB')
    
    const user = await db.collection('users').findOne(
      { discordId: session.user.discordId }
    )
    
    return NextResponse.json({
      alertGameweekStart: user?.alertGameweekStart || false,
      alertNewUploads: user?.alertNewUploads || false,
    })
  } catch (error) {
    console.error('Failed to fetch preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.discordId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const preferences = await request.json()
    const client = await clientPromise
    const db = client.db('ScrappoDB')
    
    await db.collection('users').updateOne(
      { discordId: session.user.discordId },
      { 
        $set: {
          alertGameweekStart: preferences.alertGameweekStart,
          alertNewUploads: preferences.alertNewUploads,
          updatedAt: new Date()
        }
      }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save preferences:', error)
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    )
  }
} 