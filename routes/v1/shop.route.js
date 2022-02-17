import { Router } from 'express'
import { query, param } from 'express-validator'

import { shopList, shopDetail } from '../../controllers/shop.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'

const router = Router()

router.get(
  '/',
  [
    query('longitude').isFloat(),
    query('latitude').isFloat(),
    isIfExists('radius', query).isNumeric(),

    validationFunc,
  ],
  authJWT,
  shopList,
)

router.get(
  '/:sh_no',
  [param('sh_no').isString(), validationFunc],
  authJWT,
  shopDetail,
)

export default router
