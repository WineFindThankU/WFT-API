import {
  createEmailUser,
  createSnsUser,
  findUserById,
} from '../services/users.service.js'

export const signUp = async (req, res, next) => {
  const { id, pwd, type, ...data } = req.body

  const userCheck = await findUserById(id)

  if (userCheck) {
    return res.status(409).json({
      statusCode: 409,
      error: 'CONFLICT',
      message: '사용하고 있는 아이디 입니다.',
    })
  }

  const UserType = type.toUpperCase()

  const tempData = {}
  data.nick && (tempData.us_nick = data.nick)
  data.birth && (tempData.us_birthday = data.birth)
  data.age && (tempData.us_age = data.age)
  data.gender && (tempData.us_gender = data.gender.toUpperCase())
  data.taste && (tempData.taste_type = data.taste)
  data.taste_data && (tempData.taste_data = data.taste_data)

  try {
    if (UserType === 'EMAIL') {
      await createEmailUser(id, pwd, tempData)
    } else {
      await createSnsUser(id, pwd, UserType, tempData)
    }
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      statusCode: 400,
      error: 'REQEST_ERROR',
      message: 'Request Error',
    })
  }

  return res.status(201).json({
    statusCode: 201,
    message: '회원가입 성공',
  })
}
