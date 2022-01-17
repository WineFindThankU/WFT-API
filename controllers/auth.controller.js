const signIn = (req, res, next) => {
  return res.status(201).json({
    statusCode: 201,
    message: '로그인 성공',
    data: {
      accessToken: 'access-jwt',
    },
  })
}

const tokenRefresh = (req, res, next) => {
  return res.status(201).json({
    statusCode: 201,
    message: '토큰 재발급 성공',
    data: {
      accessToken: 'access-jwt',
      refreshToken: 'refresh-jwt',
    },
  })
}

const signCheck = (req, res, next) => {
  return res
    .status(200)
    .json({ statusCode: 200, message: '로그인 상태입니다.' })
}

export { signIn, tokenRefresh, signCheck }
