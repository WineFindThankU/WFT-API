import { Router } from 'express'
import {
  signIn,
  signOut,
  signCheck,
  tokenRefresh,
} from '../../controllers/auth.controller.js'
import { authLocal, authJWT, authJWTRefresh } from '../../utils/passport.js'

import { validationFunc } from '../../utils/common.js'
import { body } from 'express-validator'

const router = Router()

router.post(
  '/sign',
  [
    body('id').isEmail().withMessage('ID_REQUIRED'),
    body('pwd').isString().withMessage('PWD_REQUIRED'),
    validationFunc,
  ],
  authLocal,
  signIn,
)
router.get('/sign', authJWT, signCheck)
router.delete('/sign', authJWT, signOut)
router.post('/sign/new', authJWTRefresh, tokenRefresh)

export default router
