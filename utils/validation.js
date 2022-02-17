import { body, validationResult } from 'express-validator'

export const validationFunc = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const errors = error.errors.map((error) => {
      return error.msg !== 'Invalid value'
        ? error.msg
        : `${error.param.toUpperCase()}_IS_WRONG`
    })
    return res
      .status(400)
      .json({ statusCode: 400, errors: errors, message: '잘못된 요청' })
  }
  next()
}

export const isIfExists = (text, type = body) => {
  return type(text).if(type(text).exists())
}
