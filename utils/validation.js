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
      .json({ statusCode: 400, errors: errors, message: 'Request Error' })
  }
  next()
}

export const isIfExists = (text) => {
  return body(text).if(body(text).exists())
}
