import mongoose from 'mongoose'

export default function connectDB(): Promise<typeof mongoose> {
  return mongoose.connect((process.env as any).CONNECT_DB_URL)
}
