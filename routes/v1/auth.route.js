import { Router } from 'express'
import { body } from 'express-validator'

import {
  signIn,
  signOut,
  signCheck,
  tokenRefresh,
} from '../../controllers/auth.controller.js'

import { authLocal, authJWT, authJWTRefresh } from '../../utils/passport.js'
import { validationFunc } from '../../utils/validation.js'
import { registType, snsRegistType } from '../../utils/constant.js'

const router = Router()

router.post(
  '/sign',
  [
    body('id').isEmail(),
    body('type').toUpperCase().isIn(registType),

    body('pwd').if(body('type').equals('EMAIL')).isString(),
    body('sns_id').if(body('type').isIn(snsRegistType)).isString(),

    validationFunc,
  ],
  authLocal,
  signIn,
)
router.get('/sign', authJWT, signCheck)
router.delete('/sign', authJWT, signOut)
router.post('/sign/new', authJWTRefresh, tokenRefresh)

export default router
