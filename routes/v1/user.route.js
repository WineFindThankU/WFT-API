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
router.delete('/', authJWT, userDisable)

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

router.get('/info', authJWT, userInfo)

export default router
