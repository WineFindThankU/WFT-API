import { config } from 'dotenv'
config()

const { PORT } = process.env

import express from 'express'
const app = express()
const port = PORT || 4000

app.get('/', (req, res) => {
  res.send('WFT API')
})

app.listen(port)
