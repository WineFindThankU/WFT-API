import app from '../app.js'
import request from 'supertest'
import pkg from '@prisma/client'
import { hashSync } from 'bcrypt'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

describe('App', () => {
  let accessToken
  let refreshToken
  let qaNo

  const mainID = 'test@test.com'
  const mainPWD = '1234'

  const main = {
    us_id: mainID,
    us_type: 'EMAIL',
    us_pwd: hashSync(mainPWD, 10),
    us_nick: 'test',
    taste_type: 1,
    taste_data: {
      1: {
        value: '1',
      },
      2: {
        value: '2',
      },
      3: {
        value: '-1',
        etc: 'only 소주',
      },
    },
    qnas: {
      create: [
        {
          qa_email: 'test@test.com',
          qa_title: 'qna test',
          qa_content: 'qna test content',
        },
      ],
    },
  }

  const test = {
    id: 'test1@test.com',
    type: 'email',
    pwd: '1234',
    nick: 'test1',
    age: 22,
    gender: 'male',
    taste_type: 1,
    taste_data: {
      1: {
        value: '1',
      },
      2: {
        value: '2',
      },
      3: {
        value: '-1',
        etc: 'only 소주',
      },
    },
  }

  beforeAll(async () => {
    await prisma.user.create({ data: main })
  })

  afterAll(async () => {
    await prisma.qna.deleteMany({})
    await prisma.user.deleteMany({})
    app.close()
  })

  it('메인화면 (Get:/)', async () => {
    return request(app).get('/').expect(200).expect('WFT API')
  })

  describe('User API', () => {
    describe('회원가입 (Post:/v1/user)', () => {
      const url = '/v1/user'
      it('Success - 회원가입 성공', async () => {
        return request(app).post(url).send(test).expect(201)
      })

      it('Success - 취향 업데이트 성공', async () => {
        return request(app)
          .post(url)
          .send({ ...test, taste_type: 2 })
          .expect(201)
      })

      it('Error - reqest.body 없거나 유효하지 않을 시', async () => {
        return request(app).post(url).expect(400)
      })

      it('Error - pwd 유효하지 않을 시 (취향 업데이트)', async () => {
        return request(app)
          .post(url)
          .send({ ...test, pwd: '12345' })
          .expect(401)
      })
    })
  })

  describe('Auth API', () => {
    describe('로그인 (Post:/v1/auth/sign)', () => {
      const url = '/v1/auth/sign'
      it('Success - 로그인 성공', async () => {
        const response = await request(app)
          .post(url)
          .send({ id: mainID, pwd: mainPWD, type: 'EMAIL' })
          .expect(201)

        accessToken = response.body.data.accessToken
        refreshToken = response.body.data.refreshToken

        expect(accessToken).toBeDefined()
        expect(refreshToken).toBeDefined()
      })

      it('Error - reqest.body 없거나 유효하지 않을 시', async () => {
        return request(app).post(url).expect(400)
      })

      it('Error - user 없을 시', async () => {
        return request(app)
          .post(url)
          .send({ id: 'test999@test.com', pwd: '1234', type: 'EMAIL' })
          .expect(404)
      })

      it('Error - pwd 유효하지 않을 시', async () => {
        return request(app)
          .post(url)
          .send({ id: mainID, pwd: '12345', type: 'EMAIL' })
          .expect(401)
      })
    })

    describe('로그인 체크 (Get:/v1/auth/sign)', () => {
      const url = '/v1/auth/sign'
      it('Success - 로그인 체크 성공', async () => {
        return request(app)
          .get(url)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
      })

      it('Error - 토큰 없거나 유효하지 않을 시', async () => {
        return request(app).get(url).expect(401)
      })
    })

    describe('토큰 재발급 (Post:/v1/auth/sign/new)', () => {
      const url = '/v1/auth/sign/new'
      it('Success - 토큰 재발급 성공', async () => {
        return request(app)
          .post(url)
          .set('Authorization', `Bearer ${refreshToken}`)
          .expect(201)
      })

      it('Error - 토큰 없거나 유효하지 않을 시', async () => {
        return request(app).post(url).expect(401)
      })
    })

    describe('로그아웃 체크 (Delete:/v1/auth/sign)', () => {
      const url = '/v1/auth/sign'
      it('Success - 로그아웃 성공', async () => {
        return request(app)
          .delete(url)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
      })

      it('Error - 토큰 없거나 유효하지 않을 시', async () => {
        return request(app).delete(url).expect(401)
      })
    })
  })

  describe('Qna API', () => {
    describe('1:1문의 리스트 (Get:/v1/qna)', () => {
      const url = '/v1/qna'
      it('Success - 1:1문의 조회 성공', async () => {
        const response = await request(app)
          .get(url)
          .query({ page: 1 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)

        console.log(response.body.data.list[0].qa_no)

        qaNo = response.body.data.list[0].qa_no

        expect(qaNo).toBeDefined()
      })

      it('Error - query 없을 시', async () => {
        return request(app).get(url).expect(400)
      })

      it('Error - 토큰 없거나 유효하지 않을 시', async () => {
        return request(app).get(url).query({ page: 1 }).expect(401)
      })
    })

    describe('1:1문의 상세 (Get:/v1/qna/:qa_no)', () => {
      it('Success - 1:1문의 조회 성공', async () => {
        const url = `/v1/qna/${qaNo}`

        return request(app)
          .get(url)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
      })

      it('Error - qa_no 유효하지 않을 시', async () => {
        const url = '/v1/qna/1234'

        return request(app)
          .get(url)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404)
      })

      it('Error - 토큰 없거나 유효하지 않을 시', async () => {
        const url = `/v1/qna/${qaNo}`

        return request(app).get(url).expect(401)
      })
    })

    describe('1:1문의 작성 (Post:/v1/qna)', () => {
      const url = '/v1/qna'
      it('Success - 1:1문의 작성 성공', async () => {
        return request(app)
          .post(url)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            email: 'test@test.com',
            title: 'qna test',
            content: 'qna test content',
          })
          .expect(201)
      })

      it('Error - body 없을 시', async () => {
        return request(app).post(url).expect(400)
      })

      it('Error - 토큰 없거나 유효하지 않을 시', async () => {
        return request(app)
          .post(url)
          .send({
            email: 'test@test.com',
            title: 'qna test',
            content: 'qna test content',
          })
          .expect(401)
      })
    })
  })
})
