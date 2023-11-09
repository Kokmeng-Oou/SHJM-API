import express from 'express'
// import cors from 'cors'
// import cookieParser from 'cookie-parser'
// import helmet from 'helmet'

// connect db
// import connectDB from './config/db_connect'
import './config/dotenv'
// import authRoutes from './routes/authRoutes'

const app: express.Application = express()
// app.use(cors())
app.use(express.json())
// app.use(cookieParser(process.env.COOKIE_SECRET))
// app.use(helmet())

const port: number = 5000

app.get('/', (req: express.Request, res: express.Response) => {
  const data: any[] = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
  ]
  return res.status(200).json({ data: data, env: process.env.Testing })
})

// app.use(`${(process.env as any).API_URL}/auth`, authRoutes)

async function runServer(): Promise<void> {
  try {
    // await connectDB((process.env as any).CONNECT_DB_URL)
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}
runServer().catch((err) => console.log('Error connecting to DB'))
