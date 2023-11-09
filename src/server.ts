import express from 'express'

const app: express.Application = express()
app.use(express.json())
const port: number = 3000

app.get('/', (req, res) => {
  const data: any[] = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Jane', age: 25 },
  ]
  return res.status(200).send({ data })
})

async function runServer(): Promise<void> {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`)
    })
  } catch (error) {
    console.log({ msg: error })
  }
}
runServer()
