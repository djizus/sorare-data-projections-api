import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer realm="Protected"'
      }
    })
  }

  try {
    const client = await clientPromise
    const db = client.db('ScrappoDB')
    
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const skip = parseInt(searchParams.get('skip') || '0')
    
    // Create the query
    let query = db
      .collection('sorareDataPredictions')
      .find({})
      .skip(skip)

    // Only apply limit if it's specified in the URL
    if (limit) {
      query = query.limit(limit)
    }
    
    const predictions = await query.toArray()

    return NextResponse.json({
      data: predictions,
      metadata: {
        count: predictions.length,
        skip,
        limit: limit || 'unlimited'
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    )
  }
} 