import jwt from 'jsonwebtoken'

export const getAccessToken = (user) => {
  const payload = {
    us_no: user.us_no,
    us_id: user.us_id,
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIME,
  })
}

export const getRefreshToken = (user) => {
  const payload = {
    us_no: user.us_no,
    us_id: user.us_id,
  }

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TIME,
  })
}
