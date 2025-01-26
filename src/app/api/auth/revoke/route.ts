import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session?.user?.discordId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await request.json()

    // Only allow admins to revoke other users' tokens
    if (userId !== session.user.discordId && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('ScrappoDB')
    
    await db.collection('users').updateOne(
      { discordId: userId },
      { 
        $set: { 
          isActive: false,
          tokenExpiresAt: new Date(),
          updatedAt: new Date()
        } 
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Token revocation error:', error)
    return NextResponse.json(
      { error: 'Failed to revoke token' },
      { status: 500 }
    )
  }
} 