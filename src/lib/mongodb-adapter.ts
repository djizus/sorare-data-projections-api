import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./mongodb"

export const mongoAdapter = MongoDBAdapter(clientPromise, {
  databaseName: 'ScrappoDB',
  collections: {
    Users: 'users',
    Accounts: 'accounts',
    Sessions: 'sessions',
    VerificationTokens: 'verification_tokens',
  }
}) 