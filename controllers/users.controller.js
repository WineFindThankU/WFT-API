import {
  createEmailUser,
  createSnsUser,
  findUserById,
} from '../services/users.service.js'

export const signUp = async (req, res, next) => {
  const { id, pwd, regist_type, data } = req.body

  const userCheck = await findUserById(id)

  if (userCheck) {
    return res.status(409).json({
      statusCode: 409,
      error: 'CONFLICT',
      message: '사용하고 있는 아이디 입니다.',
    })
  }

  const registType = regist_type.toUpperCase()

  if (registType === 'EMAIL') {
    await createEmailUser(id, pwd, data)
  } else {
    await createSnsUser(id, pwd, data, registType)
  }

  return res.status(201).json({
    statusCode: 201,
    message: '회원가입 성공',
  })
}
