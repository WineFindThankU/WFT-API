import { Router } from 'express'
import { query, param } from 'express-validator'

import { shopList, shopDetail } from '../../controllers/shop.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'
import { searchType } from '../../utils/constant.js'

const router = Router()

router.get(
  '/',
  [
    query('type').toUpperCase().isIn(searchType),

    query('longitude').if(query('type').equals('LOCATION')).isFloat(),
    query('latitude').if(query('type').equals('LOCATION')).isFloat(),
    isIfExists('radius', query).isNumeric(),

    query('keyword').if(query('type').equals('KEYWORD')).isString(),

    // isIfExists('category', query).toUpperCase().isIn(searchType),

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
