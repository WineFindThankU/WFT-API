import app from '../app.js'
import request from 'supertest'
import pkg from '@prisma/client'
import { hashSync } from 'bcrypt'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

describe('App', () => {
  let accessToken
  let refreshToken

  const mainPWD = '1234'
  const main = {
    us_id: 'test@test.com',
    us_nick: 'test',
    us_pwd: hashSync(mainPWD, 10),
  }

  const subID = 'test1@test.com'
  const subPWD = '1234'

  beforeAll(async () => {
    await prisma.user.create({ data: main })
  })

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
        .send({ id: subID, pwd: subPWD, type: 'email' })
        .expect(201)
    })
  })

  describe('Auth API', () => {
    it('로그인 (Post:/v1/auth/sign)', async () => {
      const response = await request(app)
        .post('/v1/auth/sign')
        .send({ id: main.us_id, pwd: mainPWD })
        .expect(201)

      accessToken = response.body.data.accessToken
      refreshToken = response.body.data.refreshToken

      expect(accessToken).toBeDefined()
      expect(refreshToken).toBeDefined()
    })

    it('로그인 체크 (Get:/v1/auth/sign)', () => {
      return request(app)
        .get('/v1/auth/sign')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })

    it('토큰 재발급 (Post:/v1/auth/sign/new)', () => {
      return request(app)
        .post('/v1/auth/sign/new')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(201)
    })

    it('로그아웃 (Delete:/v1/auth/sign)', () => {
      return request(app)
        .delete('/v1/auth/sign')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
    })
  })
})
