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

router.get(
  '/',
  [query('keyword').isString(), validationFunc],
  authJWT,
  wineList,
)

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

router.delete(
  '/',
  [body('uw_no').isString(), validationFunc],
  authJWT,
  wineDelete,
)

export default router
