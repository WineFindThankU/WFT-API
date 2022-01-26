import app from '../app.js'
import request from 'supertest'
import pkg from '@prisma/client'
import { hash } from 'bcrypt'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

describe('App', () => {
  let accessToken
  let refreshToken

  let mainTestID = 'test@test.com'
  let mainTestPWD = '1234'

  beforeAll(async () => {})

  afterAll(async () => {
    await prisma.user.deleteMany({})
    app.close()
  })

  it('메인화면 (Get:/)', async () => {
    return request(app).get('/').expect(200).expect('WFT API')
  })

  describe('User API', () => {
    it('회원가입 (Post:/v1/users)', async () => {
      return request(app)
        .post('/v1/users')
        .send({ id: mainTestID, pwd: mainTestPWD, us_type: 'email' })
        .expect(201)
    })
  })

  describe('Auth API', () => {
    it('로그인 (Post:/v1/auth/sign)', async () => {
      const response = await request(app)
        .post('/v1/auth/sign')
        .send({ id: mainTestID, pwd: mainTestPWD })
        .expect(201)

      accessToken = response.body.data.accessToken
      refreshToken = response.body.data.refreshToken

      expect(accessToken).toBeDefined()
      expect(refreshToken).toBeDefined()
    })

    it('로그인 체크 (Get:/v1/auth/sign)', async () => {
      return request(app)
        .get('/v1/auth/sign')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })

    it('토큰 재발급 (Post:/v1/auth/sign/new)', async () => {
      return request(app)
        .post('/v1/auth/sign/new')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(201)
    })
  })
})
