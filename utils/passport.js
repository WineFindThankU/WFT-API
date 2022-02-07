import passport from 'passport'
import passportLocal from 'passport-local'
const LocalStrategy = passportLocal.Strategy
import passportJWT from 'passport-jwt'
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

import { compare } from 'bcrypt'

import { findUserById, findUserBySnsId } from '../services/users.service.js'

export const setPassport = () => {
  passport.use(
    'jwt',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async function (payload, cb) {
        const user = await findUserById(payload.us_id)

        if (!user) {
          return cb(null, false, {
            statusCode: 404,
            error: 'NOT_FOUND',
            message: '유저를 찾지 못했습니다',
          })
        }

        const { us_pwd, us_token, ...userData } = user

        return cb(null, userData)
      },
    ),
  )

  passport.use(
    'jwt-refresh',
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_REFRESH_SECRET,
        passReqToCallback: true,
      },
      async function (req, payload, cb) {
        const user = await findUserById(payload.us_id)

        if (!user) {
          return cb(null, false, {
            statusCode: 404,
            error: 'NOT_FOUND',
            message: '유저를 찾지 못했습니다',
          })
        }

        const refreshToken = req.get('authorization').replace('Bearer ', '')

        const isMatch = await compare(refreshToken, user.us_token)

        if (!isMatch) {
          return cb(null, false, {
            statusCode: 401,
            error: 'RefreshTokenExpired',
            message: '만료된 토근',
          })
        }

        const { us_pwd, us_token, ...userData } = user

        return cb(null, userData)
      },
    ),
  )

  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'id',
        passwordField: 'pwd',
        passReqToCallback: true,
      },
      async function (req, id, pwd, cb) {
        const { sns_id, type } = req.body

        let user

        if (type === 'EMAIL') {
          user = await findUserById(id, type)
        } else {
          user = await findUserBySnsId(sns_id)
        }

        if (!user) {
          return cb(null, false, {
            statusCode: 404,
            error: 'NOT_FOUND',
            message: '유저를 찾지 못했습니다',
          })
        }

        if (type === 'EMAIL' && !(await compare(pwd, user.us_pwd))) {
          return cb(null, false, {
            statusCode: 401,
            error: 'SignUnauthorized',
            message: '로그인 실패',
          })
        }

        const { us_pwd, ...userData } = user

        return cb(null, userData)
      },
    ),
  )
}

export const authLocal = (req, res, next) => {
  try {
    passport.authenticate(
      'local',
      { sessions: false },
      (_error, user, info) => {
        if (!user) {
          return res.status(info.statusCode).json(info)
        } else {
          req.user = user
        }

        next()
      },
    )(req, res, next)
  } catch (e) {
    return res.status(401).json({
      statusCode: 401,
      error: 'SignUnauthorized',
      message: '로그인 실패',
    })
  }
}

export const authJWT = (req, res, next) => {
  try {
    passport.authenticate('jwt', { sessions: false }, (_error, user, info) => {
      if (!user) {
        return res.status(info.statusCode).json(info)
      } else {
        req.user = user
      }

      next()
    })(req, res, next)
  } catch (e) {
    return res.status(401).json({
      statusCode: 401,
      error: 'AccessTokenExpired',
      message: '만료된 토근',
    })
  }
}

export const authJWTRefresh = (req, res, next) => {
  try {
    passport.authenticate(
      'jwt-refresh',
      { sessions: false },
      (_error, user, info) => {
        if (!user) {
          return res.status(info.statusCode).json(info)
        } else {
          req.user = user
        }

        next()
      },
    )(req, res, next)
  } catch (e) {
    return res.status(401).json({
      statusCode: 401,
      error: 'RefreshTokenExpired',
      message: '만료된 토근',
    })
  }
}
