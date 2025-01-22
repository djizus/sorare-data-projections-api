import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { MongoServerError, MongoServerSelectionError } from 'mongodb'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer realm="Protected"'
        }
      })
    }

    const client = await clientPromise
    const db = client.db('ScrappoDB')
    
    // Test the connection explicitly
    try {
      await db.command({ ping: 1 })
    } catch (dbError) {
      console.error('Database ping failed:', dbError)
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 503 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const skip = parseInt(searchParams.get('skip') || '0')
    
    const predictions = await db
      .collection('sorareDataPredictions')
      .find({}, { projection: { _id: 0 } })
      .skip(skip)
      .limit(limit || 0)
      .toArray()

    return NextResponse.json({
      data: predictions,
      metadata: {
        count: predictions.length,
        skip,
        limit: limit || 'unlimited'
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof MongoServerSelectionError) {
      return NextResponse.json(
        { error: 'Database connection timeout' },
        { status: 503 }
      )
    }
    
    if (error instanceof MongoServerError) {
      return NextResponse.json(
        { error: 'Database error' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 