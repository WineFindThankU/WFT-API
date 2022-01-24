import { Router } from 'express'
import {
  signIn,
  signCheck,
  tokenRefresh,
} from '../../controllers/auth.controller.js'
import { authLocal, authJWT, authJWTRefresh } from '../../utils/passport.js'

const router = Router()

router.post('/sign', authLocal, signIn)
router.get('/sign', authJWT, signCheck)
router.post('/sign/new', authJWTRefresh, tokenRefresh)

export default router
