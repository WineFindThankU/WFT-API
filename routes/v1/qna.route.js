import { Router } from 'express'
import { body, query, param } from 'express-validator'

import {
  qnaList,
  qnaWrite,
  qnaDetail,
} from '../../controllers/qna.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'

const router = Router()

/**
 * @openapi
 * /qna:
 *   get:
 *     tags:
 *       - Qna
 *     summary: 1:1문의 리스트
 *     security:
 *       - AccessToken: []
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/qnaListSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "1:1문의 조회 성공"
 *               data:
 *                  count: 1
 *                  next: false
 *                  data: [{
                "qa_no": "cl5iw876u03725h62h97xh0k2",
                "us_no": "cl11w4t220241lg62nqa3zadc",
                "qa_email": "test@test.com",
                "qa_title": "1:1문의 테스트",
                "qa_content": "1:1문의 테스트입니다.",
                "qa_reply": null,
                "qa_status": "OPEN",
                "created_at": "2022-07-13T00:57:59.141Z",
                "closed_at": null
            }]
 */
router.get(
  '/',
  [
    query('page').isNumeric(),
    isIfExists('limit', query).isNumeric(),

    validationFunc,
  ],
  authJWT,
  qnaList,
)

/**
 * @openapi
 * /qna/{no}:
 *   get:
 *     tags:
 *       - Qna
 *     summary: 1:1문의 상세
 *     security:
 *       - AccessToken: []
 *     parameters:
 *       - in: path
 *         name: no
 *         schema:
 *           type: string
 *         required: true
 *         description: 1:1문의 고유값
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/qnaListSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "1:1문의 조회 성공"
 *               data:
 *                 qa_no: cl5iw876u03725h62h97xh0k2
 *                 us_no: cl11w4t220241lg62nqa3zadc
 *                 qa_email: test@test.com
 *                 qa_title: 1:1문의 테스트
 *                 qa_content: 1:1문의 테스트입니다.
 *                 qa_reply: null
 *                 qa_status: OPEN
 *                 created_at: "2022-07-13T00:57:59.141Z"
 *                 closed_at: null
 */
router.get(
  '/:qa_no',
  [param('qa_no').isString(), validationFunc],
  authJWT,
  qnaDetail,
)

/**
 * @openapi
 * /qna:
 *   post:
 *     tags:
 *       - Qna
 *     summary: 1:1문의 작성
 *     security:
 *       - AccessToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/qnaWriteRequest'
 *           example:
 *             email: test@test.com
 *             title: 1:1문의 테스트
 *             content: "1:1문의 테스트입니다."
 *     responses:
 *       201:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *             example:
 *               statusCode: 201
 *               message: "1:1문의 작성 완료"
 */
router.post(
  '/',
  [
    body('email').isEmail(),
    body('title').isString(),
    body('content').isString(),

    validationFunc,
  ],
  authJWT,
  qnaWrite,
)

export default router
