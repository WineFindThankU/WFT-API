import { Router } from 'express'
import v1Router from './v1/index.js'

import { swaggerUi, specs } from '../utils/swagger.js'

const router = Router()

router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
router.use('/v1', v1Router)

export default router
