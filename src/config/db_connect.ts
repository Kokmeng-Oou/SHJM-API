import mongoose from 'mongoose'

export default function connectDB(url: string): Promise<typeof mongoose> {
  return mongoose.connect(url)
}

const db = mongoose.connection
db.on('open', () => {
  console.log('Connected to MongoDB')
})

db.on('error', (err) => {
  console.error('Connection error:', err)
})

db.on('close', () => {
  console.log('Disconnected from MongoDB')
})
