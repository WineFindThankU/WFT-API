import { Router } from 'express'
import { body, query } from 'express-validator'

import {
  signUp,
  userDisable,
  userWine,
  userShop,
  userBookmark,
  userInfo,
} from '../../controllers/user.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'
import { registType, snsRegistType, gender } from '../../utils/constant.js'

const router = Router()

/**
 * @openapi
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: 회원가입
 *     description: 이미 회원가입 되어 있을 시 취향 업데이트 기능으로 변경됨
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/signUpRequest'
 *           examples:
 *             "회원가입 (SNS)":
 *               value:
 *                 id: test@test.com
 *                 type: naver
 *                 sns_id: test
 *                 nick: test
 *                 birthday: 2001-12-01
 *                 age: 22
 *                 gender: male
 *                 taste_type: 1
 *                 taste_data: {
 *                   1: {
 *                     value: 1
 *                   },
 *                   2: {
 *                       value: 2
 *                   },
 *                   3: {
 *                       value: -1,
 *                       etc: only 소주
 *                   }
 *                 }
 *             "회원가입 (EMAIL)":
 *               value:
 *                 id: test@test.com
 *                 type: email
 *                 pwd: 1234
 *                 nick: test
 *                 birthday: 2001-12-01
 *                 age: 22
 *                 gender: male
 *                 taste_type: 1
 *                 taste_data: {
 *                   1: {
 *                     value: 1
 *                   },
 *                   2: {
 *                       value: 2
 *                   },
 *                   3: {
 *                       value: -1,
 *                       etc: only 소주
 *                   }
 *                 }
 *     responses:
 *       201:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/successResponse'
 *             examples:
 *               "회원가입 성공":
 *                 value:
 *                   statusCode: 201
 *                   message: 회원가입 성공
 *               "취향 업데이트 성공":
 *                 value:
 *                   statusCode: 201
 *                   message: 취향 업데이트 성공
 */
router.post(
  '/',
  [
    body('id').isEmail(),
    body('type').toUpperCase().isIn(registType),

    body('pwd').if(body('type').equals('EMAIL')).isString(),
    body('sns_id').if(body('type').isIn(snsRegistType)).isString(),

    isIfExists('birthday').isISO8601(),
    isIfExists('age').isNumeric(),
    isIfExists('nick').isString(),
    isIfExists('gender').toUpperCase().isIn(gender),
    isIfExists('taste_type').isNumeric(),
    isIfExists('taste_data').isObject(),

    validationFunc,
  ],
  signUp,
)

/**
 * @openapi
 * /user:
 *   delete:
 *     tags:
 *       - User
 *     summary: 회원탈퇴
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
 *               message: 회원탈퇴 성공
 */
router.delete('/', authJWT, userDisable)

/**
 * @openapi
 * /user/wine:
 *   get:
 *     tags:
 *       - User
 *     summary: 내가 구매한 와인
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
 *               $ref: '#/components/schemas/userWineSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "구매 와인 리스트 조회 성공"
 *               data:
 *                  count: 1
 *                  next: false
 *                  data: [{
                "uw_no": "cl3u6688h0002vz4rpgtq2tvm",
                "uw_name": "test",
                "uw_country": "korea",
                "uw_vintage": "2001",
                "uw_price_range": 10000,
                "purchased_at": "2001-01-01T15:00:00.000Z",
                "shop": {
                    "sh_no": "cl09oopq40003eh4rrfguf50i",
                    "sh_name": "라보데가",
                    "sh_category": "PRIVATE",
                    "sh_url": "http://instagram.com/labodega.kr",
                    "sh_time": null
                },
                "wine": {
                    "wn_no": "cl096cotx005831m0o75opumj",
                    "wn_name": "비냐 아로모, 아로모 레세르바 프리바다 카르메네르",
                    "wn_name_en": "Vina Aromo, Aromo Reserva Privada Carmenere",
                    "wn_kind": "카르메네르 (Carmenere)",
                    "wn_country": "칠레(Chile)",
                    "wn_alcohol": "13.5~14.5 %",
                    "wn_img": "http://image.toast.com/aaaacby/wft/empty/empty_85x160.png",
                    "wn_category": "레드"
                }
            }]
 *
 */
router.get(
  '/wine',
  [
    query('page').isNumeric(),
    isIfExists('limit', query).isNumeric(),

    validationFunc,
  ],
  authJWT,
  userWine,
)

/**
 * @openapi
 * /user/shop:
 *   get:
 *     tags:
 *       - User
 *     summary: 다녀온 와인샵
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
 *               $ref: '#/components/schemas/userShopSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "다녀온 와인샵 리스트 조회 성공"
 *               data:
 *                  count: 1
 *                  next: false
 *                  data: [{
                "shop": {
                    "sh_no": "cl09oopq40003eh4rrfguf50i",
                    "sh_name": "라보데가",
                    "sh_category": "PRIVATE",
                    "sh_url": "http://instagram.com/labodega.kr",
                    "sh_time": null,
                    "sh_img": "http://image.toast.com/aaaacby/wft/empty/empty_80x80.png"
                },
                "uh_bookmark": true,
                "uh_wine_cnt": 2
            }]
 *
 */
router.get(
  '/shop',
  [
    query('page').isNumeric(),
    isIfExists('limit', query).isNumeric(),

    validationFunc,
  ],
  authJWT,
  userShop,
)

/**
 * @openapi
 * /user/bookmark:
 *   get:
 *     tags:
 *       - User
 *     summary: 즐겨찾기한 와인샵
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
 *               $ref: '#/components/schemas/userShopSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "즐겨찾기한 와인샵 리스트 조회 성공"
 *               data:
 *                  count: 1
 *                  next: false
 *                  data: [{
                "shop": {
                    "sh_no": "cl09oopq40003eh4rrfguf50i",
                    "sh_name": "라보데가",
                    "sh_category": "PRIVATE",
                    "sh_url": "http://instagram.com/labodega.kr",
                    "sh_time": null,
                    "sh_img": "http://image.toast.com/aaaacby/wft/empty/empty_80x80.png"
                },
                "uh_bookmark": true,
                "uh_wine_cnt": 2
            }]
 *
 */
router.get(
  '/bookmark',
  [
    query('page').isNumeric(),
    isIfExists('limit', query).isNumeric(),

    validationFunc,
  ],
  authJWT,
  userBookmark,
)

/**
 * @openapi
 * /user/info:
 *   get:
 *     tags:
 *       - User
 *     summary: 마이페이지
 *     security:
 *       - AccessToken: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userInfoSuccessResponse'
 *             example:
 *               statusCode: 200
 *               message: "마이페이지 조회 성공"
 *               data:
 *                 user:
 *                   us_id: "test1111111@test.com"
 *                   us_nick: "와린이-71549"
 *                   taste_type: "1"
 *                 wine:
 *                   count: 1
 *                   data: [{
                    "uw_no": "cl3u6688h0002vz4rpgtq2tvm",
                    "uw_name": "test",
                    "uw_country": "korea",
                    "uw_vintage": "2001",
                    "uw_price_range": 10000,
                    "purchased_at": "2001-01-01T15:00:00.000Z",
                    "shop": {
                        "sh_no": "cl09oopq40003eh4rrfguf50i",
                        "sh_name": "라보데가",
                        "sh_category": "PRIVATE",
                        "sh_url": "http://instagram.com/labodega.kr",
                        "sh_time": null
                    },
                    "wine": {
                        "wn_no": "cl096cotx005831m0o75opumj",
                        "wn_name": "비냐 아로모, 아로모 레세르바 프리바다 카르메네르",
                        "wn_name_en": "Vina Aromo, Aromo Reserva Privada Carmenere",
                        "wn_kind": "카르메네르 (Carmenere)",
                        "wn_country": "칠레(Chile)",
                        "wn_alcohol": "13.5~14.5 %",
                        "wn_img": "http://image.toast.com/aaaacby/wft/empty/empty_105x105.png",
                        "wn_category": "레드"
                    }
                }]
 *               shop:
 *                 count: 1
 *                 data: [{
                    "shop": {
                        "sh_no": "cl09oopq40003eh4rrfguf50i",
                        "sh_name": "라보데가",
                        "sh_category": "PRIVATE",
                        "sh_url": "http://instagram.com/labodega.kr",
                        "sh_time": null,
                        "sh_img": "http://image.toast.com/aaaacby/wft/empty/empty_160x82.png"
                    },
                    "uh_bookmark": true,
                    "uh_wine_cnt": 1
                }]
 *               bookmark:
 *                 count: 1
 *                 data: [{
 *                   "shop": {
                        "sh_no": "cl09oopq40003eh4rrfguf50i",
                        "sh_name": "라보데가",
                        "sh_category": "PRIVATE",
                        "sh_url": "http://instagram.com/labodega.kr",
                        "sh_time": null,
                        "sh_img": "http://image.toast.com/aaaacby/wft/empty/empty_160x82.png"
                    },
                    "uh_bookmark": true,
                    "uh_wine_cnt": 1
                }]
 *
 */
router.get('/info', authJWT, userInfo)

export default router
