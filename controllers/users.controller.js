const signUp = (req, res, next) => {
  return res.status(201).json({ statusCode: 201, message: '회원가입 성공' })
}

export { signUp }
