import { Router } from 'express'
import {
  signIn,
  signCheck,
  tokenRefresh,
} from '../../controllers/auth.controller.js'

const router = Router()

router.post('/sign', signIn)
router.get('/sign', signCheck)
router.post('/sign/new', tokenRefresh)

export default router
