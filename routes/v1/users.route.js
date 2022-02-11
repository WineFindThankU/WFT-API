import { Router } from 'express'
import { body } from 'express-validator'

import { signUp, userDisable } from '../../controllers/users.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'
import { registType, snsRegistType, gender } from '../../utils/constant.js'

const router = Router()

router.post(
  '/',
  [
    body('id').isEmail(),
    body('type').toUpperCase().isIn(registType),

    body('pwd').if(body('type').equals('EMAIL')).isString(),
    body('sns_id').if(body('type').isIn(snsRegistType)).isString(),

    isIfExists('birthday').isISO8601(),
    isIfExists('age').isNumeric(),
    isIfExists('nick').isString(),
    isIfExists('gender').toUpperCase().isIn(gender),
    isIfExists('taste_type').isNumeric(),
    isIfExists('taste_data').isObject(),

    validationFunc,
  ],
  signUp,
)
router.delete('/', authJWT, userDisable)

export default router
