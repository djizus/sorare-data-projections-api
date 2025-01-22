import { MongoClient, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {
  connectTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000,  // 45 seconds
  serverSelectionTimeoutMS: 10000, // 10 seconds
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  retryReads: true,
  w: 'majority'
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

async function connectToDatabase(): Promise<MongoClient> {
  try {
    const newClient = new MongoClient(uri, options)
    await newClient.connect()
    await newClient.db('admin').command({ ping: 1 })
    console.log('MongoDB connected successfully')
    return newClient
  } catch (error) {
    console.error('MongoDB connection error:', error)
    // Wait 5 seconds before retrying
    await new Promise(resolve => setTimeout(resolve, 5000))
    return connectToDatabase()
  }
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = connectToDatabase()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = connectToDatabase()
}

export default clientPromise 