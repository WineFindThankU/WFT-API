import { Router } from 'express'
import { signUp } from '../../controllers/users.controller.js'

import { validationFunc } from '../../utils/common.js'
import { body } from 'express-validator'

const router = Router()

router.post(
  '/',
  [
    body('id').isEmail().withMessage('ID_REQUIRED'),
    body('pwd').isString().withMessage('PWD_REQUIRED'),
    body('type').isString().withMessage('TYPE_REQUIRED'),
    validationFunc,
  ],
  signUp,
)

export default router
