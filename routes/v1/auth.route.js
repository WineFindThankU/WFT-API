import { Router } from 'express'
import { body } from 'express-validator'

import {
  signIn,
  signOut,
  signCheck,
  tokenRefresh,
} from '../../controllers/auth.controller.js'

import { authLocal, authJWT, authJWTRefresh } from '../../utils/passport.js'
import { validationFunc } from '../../utils/validation.js'
import { registType, snsRegistType } from '../../utils/constant.js'

const router = Router()

/**
 * @openapi
 * /auth/sign:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 로그인
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signInRequest'
 *           examples:
 *             "회원가입 (SNS)":
 *               value:
 *                 id: test@test.com
 *                 type: naver
 *                 sns_id: test
 *             "회원가입 (EMAIL)":
 *               value:
 *                 id: test@test.com
 *                 type: email
 *                 pwd: "1234"
 *     responses:
 *       201:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signInSuccessResponse'
 *             example:
 *               statusCode: 201
 *               message: 로그인 성공
 *               data:
 *                  accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
 *                  refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
 */
router.post(
  '/sign',
  [
    body('id').isEmail(),
    body('type').toUpperCase().isIn(registType),

    body('pwd').if(body('type').equals('EMAIL')).isString(),
    body('sns_id').if(body('type').isIn(snsRegistType)).isString(),

    validationFunc,
  ],
  authLocal,
  signIn,
)

/**
 * @openapi
 * /auth/sign:
 *   get:
 *     tags:
 *       - Auth
 *     summary: 로그인 체크
 *     description: 토큰 유효한지 체크용
 *     security:
 *       - AccessToken: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *             example:
 *               statusCode: 200
 *               message: "로그인 상태"
 */
router.get('/sign', authJWT, signCheck)

/**
 * @openapi
 * /auth/sign:
 *   delete:
 *     tags:
 *       - Auth
 *     summary: 로그아웃
 *     security:
 *       - AccessToken: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *             example:
 *               statusCode: 200
 *               message: "로그아웃 성공"
 */
router.delete('/sign', authJWT, signOut)

/**
 * @openapi
 * /auth/sign/new:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 토큰 재발급
 *     security:
 *       - RefreshToken: []
 *     responses:
 *       201:
 *         description: 토큰 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/signNewSuccessResponse'
 *             example:
 *               statusCode: 201
 *               message: 토큰 재발급 성공
 *               data:
 *                  accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
 */
router.post('/sign/new', authJWTRefresh, tokenRefresh)

export default router
