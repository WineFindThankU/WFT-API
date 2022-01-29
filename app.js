import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const { PORT } = process.env

const app = express()
const port = PORT || 4000

app.get('/', (req, res) => {
  res.send('WFT API')
})

app.listen(port)
