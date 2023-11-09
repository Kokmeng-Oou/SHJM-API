import mongoose from 'mongoose'

export default function connectDB(url: string): Promise<typeof mongoose> {
  return mongoose.connect(url)
}
