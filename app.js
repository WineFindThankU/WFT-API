import { config } from 'dotenv'
import express from 'express'
import router from './routes/index.js'

export const createServer = () => {
  config()

  const { PORT } = process.env

  const app = express()
  const port = PORT || 4000

  app.use(router)

  app.get('/', (req, res) => {
    res.send('WFT API')
  })

  app.listen(port)

  return app
}

createServer()
