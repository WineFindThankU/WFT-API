import { Router } from 'express'
import userRouter from './user.route.js'
import authRouter from './auth.route.js'
import qnaRouter from './qna.route.js'

const router = Router()

router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/qna', qnaRouter)

export default router
