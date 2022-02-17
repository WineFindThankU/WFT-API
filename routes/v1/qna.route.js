import { Router } from 'express'
import { body, query, param } from 'express-validator'

import {
  qnaList,
  qnaWrite,
  qnaDetail,
} from '../../controllers/qna.controller.js'

import { authJWT } from '../../utils/passport.js'
import { validationFunc, isIfExists } from '../../utils/validation.js'

const router = Router()

router.get(
  '/',
  [
    query('page').isNumeric(),
    isIfExists('limit', query).isNumeric(),

    validationFunc,
  ],
  authJWT,
  qnaList,
)

router.get(
  '/:qa_no',
  [param('qa_no').isString(), validationFunc],
  authJWT,
  qnaDetail,
)

router.post(
  '/',
  [
    body('email').isEmail(),
    body('title').isString(),
    body('content').isString(),

    validationFunc,
  ],
  authJWT,
  qnaWrite,
)

export default router
