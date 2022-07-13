import { Router } from 'express'
import { query, param, body } from 'express-validator'

import {
  shopList,
  shopDetail,
  shopBookmark,
} from '../../controllers/shop.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'
import { searchType, shopCategory } from '../../utils/constant.js'

const router = Router()

/**
 * @openapi
 * /shop:
 *   get:
 *     tags:
 *       - Shop
 *     summary: 와인샵 리스트
 *     security:
 *       - AccessToken: []
 *     parameters:
 *       - $ref: '#/components/parameters/type'
 *       - $ref: '#/components/parameters/longitude'
 *       - $ref: '#/components/parameters/latitude'
 *       - $ref: '#/components/parameters/radius'
 *       - $ref: '#/components/parameters/keyword'
 *           
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/shopListSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "와인샵 조회 성공"
 *               data:
 *                  count: 1
 *                  next: false
 *                  data: [{
            "sh_no": "cl09oopq40000eh4raa08kyau",
            "sh_name": "네비올로 분당",
            "sh_category": "PRIVATE",
            "sh_address": "경기도 성남시 분당구 서현로478번길 17 네비올로 와인샵",
            "sh_tell": "0507-1309-2226",
            "sh_url": null,
            "sh_latitude": 37.3701697,
            "sh_longitude": 127.1457963
        }]
 *
 */
router.get(
  '/',
  [
    isIfExists('type', query).toUpperCase().isIn(searchType),

    query('longitude').if(query('type').equals('LOCATION')).isFloat(),
    query('latitude').if(query('type').equals('LOCATION')).isFloat(),
    isIfExists('radius', query).isNumeric(),

    query('keyword').if(query('type').equals('KEYWORD')).isString(),
    isIfExists('category', query).toUpperCase().isIn(shopCategory),

    validationFunc,
  ],
  authJWT,
  shopList,
)

/**
 * @openapi
 * /shop/{no}:
 *   get:
 *     tags:
 *       - Shop
 *     summary: 와인샵 상세
 *     security:
 *       - AccessToken: []
 *     parameters:
 *       - in: path
 *         name: no
 *         schema:
 *           type: string
 *         required: true
 *         description: 와인샵 고유값
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/shopDetailSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "와인샵 조회 성공"
 *               data:
 *                 sh_no: cl09oopq40003eh4rrfguf50i
 *                 sh_name: 라보데가
 *                 sh_category: PRIVATE
 *                 sh_address: 경기도 성남시 분당구 운중로 229 1층 102호
 *                 sh_tell: 031-701-2021
 *                 sh_url: http://instagram.com/labodega.kr
 *                 sh_latitude: 37.3900748
 *                 sh_longitude: 127.0886875
 *                 sh_bookmark: true
 *                 userWines: [{
                "uw_no": "cl5iyarq30060qi62zny0mc4k",
                "uw_name": "test",
                "uw_vintage": "2001",
                "uw_price_range": 10000,
                "purchased_at": "2001-01-01T15:00:00.000Z",
                "wine": {
                    "wn_no": "cl096cotx005831m0o75opumj",
                    "wn_name": "비냐 아로모, 아로모 레세르바 프리바다 카르메네르",
                    "wn_name_en": "Vina Aromo, Aromo Reserva Privada Carmenere",
                    "wn_kind": "카르메네르 (Carmenere)",
                    "wn_country": "칠레(Chile)",
                    "wn_alcohol": "13.5~14.5 %",
                    "wn_img": "http://image.toast.com/aaaacby/wft/empty/empty_105x147.png",
                    "wn_category": "레드"
                }
            }]
 */
router.get(
  '/:sh_no',
  [param('sh_no').isString(), validationFunc],
  authJWT,
  shopDetail,
)

/**
 * @openapi
 * /shop/{no}/bookmark:
 *   get:
 *     tags:
 *       - Shop
 *     summary: 와인샵 즐겨찾기
 *     security:
 *       - AccessToken: []
 *     parameters:
 *       - in: path
 *         name: no
 *         schema:
 *           type: string
 *         required: true
 *         description: 와인샵 고유값
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/shopBookmarkRequest'
 *           example:
 *             bookmark: false
 *     responses:
 *       201:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *             example:
 *               statusCode: 201
 *               message: "와인샵 즐겨찾기 성공"
 */
router.post(
  '/:sh_no/bookmark',
  [param('sh_no').isString(), body('bookmark').isBoolean(), validationFunc],
  authJWT,
  shopBookmark,
)

export default router
