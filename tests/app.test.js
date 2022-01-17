import app from '../app.js'
import request from 'supertest'

describe('App', () => {
  beforeAll(() => {})

  afterAll(() => {
    app.close()
  })

  it('메인화면 (Get:/)', async () => {
    return request(app).get('/').expect(200).expect('WFT API')
  })

  describe('User API', () => {
    it('회원가입 ({Post}:/api/v1/users)', async () => {
      return request(app).post('/api/v1/users').expect(201)
    })
  })

  describe('Auth API', () => {
    it('로그인 (Post:/api/v1/auth/sign)', async () => {
      return request(app).post('/api/v1/auth/sign').expect(201)
    })

    it('로그인 체크 (Get:/api/v1/auth/sign)', async () => {
      return request(app).get('/api/v1/auth/sign').expect(200)
    })

    it('토큰 재발급 (Post:/api/v1/auth/sign/new)', async () => {
      return request(app).post('/api/v1/auth/sign/new').expect(201)
    })
  })
})
