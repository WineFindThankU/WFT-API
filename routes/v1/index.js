import { Router } from 'express'
import userRouter from './user.route.js'
import authRouter from './auth.route.js'
import qnaRouter from './qna.route.js'
import shopRouter from './shop.route.js'
import wineRouter from './wine.route.js'
import appRouter from './app.route.js'

const router = Router()

/**
 * @openapi
 * /error:
 *   get:
 *     summary: 공통에러
 *     responses:
 *       400:
 *         description: 잘못된 REQUEST
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/validationError'
 *       401:
 *         description: 유저 권한 에러
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               "AccessToken":
 *                 value:
 *                   statusCode: 401
 *                   error: EXPIRED_ACCESS_TOKEN
 *                   message: 만료된 토큰
 *               "RefeshToken":
 *                 value:
 *                   statusCode: 401
 *                   error: EXPIRED_REFRESH_TOKEN
 *                   message: 만료된 토큰
 *       404:
 *         description: 유저 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               statusCode: 404
 *               error: USER_NOT_FOUND
 *               message: 유저 조회 실패
 *       403:
 *         description: 비활성화 유저
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               statusCode: 403
 *               error: DISABLED_USER
 *               message: 비활성화된 유저
 *       500:
 *         description: 데이터 처리 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               statusCode: 500
 *               error: DATA_ERROR
 *               message: 데이터 처리 실패
 */

/**
 *  @openapi
 *  tags:
 *    name: User
 *    description: User 관련 API
 */
router.use('/user', userRouter)
/**
 *  @openapi
 *  tags:
 *    name: Auth
 *    description: Auth 관련 API
 */
router.use('/auth', authRouter)
/**
 *  @openapi
 *  tags:
 *    name: Qna
 *    description: Qna 관련 API
 */
router.use('/qna', qnaRouter)
/**
 *  @openapi
 *  tags:
 *    name: Shop
 *    description: Shop 관련 API
 */
router.use('/shop', shopRouter)
/**
 *  @openapi
 *  tags:
 *    name: Wine
 *    description: Wine 관련 API
 */
router.use('/wine', wineRouter)
/**
 *  @openapi
 *  tags:
 *    name: App
 *    description: App 관련 API
 */
router.use('/app', appRouter)

export default router
