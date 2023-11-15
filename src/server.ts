import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import upload from 'multer'
import { google } from 'googleapis'

// connect db
import connectDB from './config/db_connect'
import './config/dotenv'
import 'express-async-errors'

//middleware
import NotFoundError from './err/not-found'
import errorHandlerMiddleware from './err/error-handler'

// routes
import authRoutes from './routes/authRoutes'
import productRoutes from './routes/productRoutes'

const app: express.Application = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(helmet())

const port: string | number | undefined = process.env.PORT

app.get('/', (req: express.Request, res: express.Response) => {
  const data: any[] = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
  ]
  return res.status(200).json({ data: data, env: (process.env as any).TESTING })
})

app.use(`${process.env.API_URL}/auth`, authRoutes)
app.use(`${process.env.API_URL}/product`, productRoutes)

// set middleware
app.use(errorHandlerMiddleware)

async function runServer(): Promise<void> {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}
runServer().catch((err) => console.log('Error connecting to DB'))
