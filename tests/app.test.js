import { createServer } from '../app.js'

let app

beforeEach((done) => {
  app = createServer()
})

afterEach((done) => {
  app.close()
})
