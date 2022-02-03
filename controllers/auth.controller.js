import { getAccessToken, getRefreshToken } from '../services/auth.service.js'
import {
  updateRefreshToken,
  deleteRefreshToken,
} from '../services/users.service.js'

const signIn = async (req, res, next) => {
  const user = req.user

  const accessToken = getAccessToken(user)
  const refreshToken = getRefreshToken(user)

  await updateRefreshToken(user.us_no, refreshToken)

  return res.status(201).json({
    statusCode: 201,
    message: '로그인 성공',
    data: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
  })
}

const signOut = async (req, res, next) => {
  const user = req.user

  await deleteRefreshToken(user.us_no)

  return res.status(200).json({
    statusCode: 200,
    message: '로그아웃 성공',
  })
}

const tokenRefresh = (req, res, next) => {
  const user = req.user

  const accessToken = getAccessToken(user)

  return res.status(201).json({
    statusCode: 201,
    message: '토큰 재발급 성공',
    data: {
      accessToken: accessToken,
    },
  })
}

const signCheck = (req, res, next) => {
  return res
    .status(200)
    .json({ statusCode: 200, message: '로그인 상태입니다.' })
}

export { signIn, signOut, tokenRefresh, signCheck }
