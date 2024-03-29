import { getAccessToken, getRefreshToken } from '../services/auth.service.js'
import {
  updateRefreshToken,
  deleteRefreshToken,
} from '../services/user.service.js'

export const signIn = async (req, res) => {
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

export const signOut = async (req, res) => {
  const user = req.user

  await deleteRefreshToken(user.us_no)

  return res.status(200).json({
    statusCode: 200,
    message: '로그아웃 성공',
  })
}

export const tokenRefresh = (req, res) => {
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

export const signCheck = (_req, res) => {
  return res.status(200).json({ statusCode: 200, message: '로그인 상태' })
}
