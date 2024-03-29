import { config } from 'dotenv'
import { join } from 'path'
import { createServer } from 'http'

import express from 'express'

import { setPassport } from './utils/passport.js'

import router from './routes/index.js'

const App = () => {
  if (process.env.NODE_ENV === 'test') {
    config({
      path: join(process.cwd(), '.env.test'),
    })
  } else {
    config()
  }

  const { PORT } = process.env
  const port = PORT || 4000

  setPassport()

  const app = express()

  app.use(express.json())

  app.use(router)

  app.get('/', (req, res) => {
    res.send('WFT API')
  })

  const server = createServer(app)

  server.listen(port)

  return server
}

export default App()
