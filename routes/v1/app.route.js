import { Router } from 'express'
import { body } from 'express-validator'

import {
  ping,
  appVersion,
  newVersion,
} from '../../controllers/app.controller.js'

import { validationFunc } from '../../utils/validation.js'
import { os } from '../../utils/constant.js'

const router = Router()

router.get('/ping', ping)

router.get('/version', appVersion)

router.post(
  '/version',
  [
    body('version').isString(),
    body('os').toUpperCase().isIn(os),
    body('force').isBoolean(),

    validationFunc,
  ],
  newVersion,
)

export default router
