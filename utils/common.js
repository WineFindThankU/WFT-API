import { validationResult } from 'express-validator'

export const validationFunc = (req, res, next) => {
  const error = validationResult(req)
  if (!error.isEmpty()) {
    const errors = error.errors.map((error) => {
      return error.msg
    })
    return res
      .status(400)
      .json({ statusCode: 400, errors: errors, message: 'Request Error' })
  }
  next()
}
