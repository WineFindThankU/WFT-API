import { Router } from 'express'
import { query, param, body } from 'express-validator'

import {
  shopList,
  shopDetail,
  shopBookmark,
  shopWineWrite,
} from '../../controllers/shop.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'
import { searchType, shopCategory } from '../../utils/constant.js'

const router = Router()

router.get(
  '/',
  [
    query('type').toUpperCase().isIn(searchType),

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

router.get(
  '/:sh_no',
  [param('sh_no').isString(), validationFunc],
  authJWT,
  shopDetail,
)

router.post(
  '/:sh_no/bookmark',
  [param('sh_no').isString(), body('bookmark').isBoolean(), validationFunc],
  authJWT,
  shopBookmark,
)

router.post(
  '/:sh_no/wine',
  [param('sh_no').isString(), validationFunc],
  authJWT,
  shopWineWrite,
)

export default router
