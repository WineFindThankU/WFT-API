import { Router } from 'express'
import { query, body } from 'express-validator'

import {
  wineList,
  wineAdd,
  wineDelete,
} from '../../controllers/wine.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'

const router = Router()

/**
 * @openapi
 * /wine:
 *   get:
 *     tags:
 *       - Wine
 *     summary: 와인 검색
 *     security:
 *       - AccessToken: []
 *     parameters:
 *       - $ref: '#/components/parameters/keyword'
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/wineListSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "와인 조회 성공"
 *               data:
 *                  count: 1
 *                  next: false
 *                  data: [{
            "wn_no": "cl096cp871160831m0s0ankoxr",
            "wn_brand": "와인 훌리건스 Wine Hooligans",
            "wn_name": "와인 훌리건스 싸이클즈 글래디에이터 샤도네이",
            "wn_name_en": "Wine Hooligans Cycles Gladiator Chardonnay",
            "wn_country": "미국(U.S.A)",
            "wn_nation": "몬터레이(Monterey)",
            "wn_kind": "샤르도네 (Chardonnay) 96%, 피노 그리지오 (Pinot Grigio) 4%",
            "wn_alcohol": null,
            "wn_img": null
        }]
 */
router.get(
  '/',
  [query('keyword').isString(), validationFunc],
  authJWT,
  wineList,
)

/**
 * @openapi
 * /wine:
 *   post:
 *     tags:
 *       - Wine
 *     summary: 와인 등록
 *     security:
 *       - AccessToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/wineAddRequest'
 *           example:
 *             sh_no: cl09oopq40003eh4rrfguf50i
 *             wn_no: cl096cotx005831m0o75opumj
 *             name: test
 *             country: korea
 *             vintage: "2001"
 *             purchased_at: "2001-01-02"
 *             price_range: 10000
 *     responses:
 *       201:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *             example:
 *               statusCode: 201
 *               message: "와인 등록 성공"
 */
router.post(
  '/',
  [
    body('sh_no').isString(),
    isIfExists('wn_no').isString(),
    body('name').isString(),
    body('country').isString(),
    body('vintage').isString(),
    body('purchased_at').isISO8601(),
    isIfExists('price').isNumeric(),
    isIfExists('price_range').isNumeric(),
    validationFunc,
  ],
  authJWT,
  wineAdd,
)

/**
 * @openapi
 * /wine:
 *   delete:
 *     tags:
 *       - Wine
 *     summary: 와인 삭제
 *     security:
 *       - AccessToken: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/wineDeleteRequest'
 *           example:
 *             wn_no: cl13v9m3100166m62l9wbw3qp
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *             example:
 *               statusCode: 200
 *               message: "와인 삭제 성공"
 */
router.delete(
  '/',
  [body('uw_no').isString(), validationFunc],
  authJWT,
  wineDelete,
)

export default router
