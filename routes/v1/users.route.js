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
    body('regist_type').isString().withMessage('REGIST_TYPE_REQUIRED'),
    body('data').isJSON().withMessage('DATA_REQUIRED'),
    validationFunc,
  ],
  signUp,
)

export default router
