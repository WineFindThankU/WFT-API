import passport from 'passport'
import passportLocal from 'passport-local'
const LocalStrategy = passportLocal.Strategy
import passportJWT from 'passport-jwt'
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

import { compare } from 'bcrypt'
import moment from 'moment'

import { findUserById, findUserBySnsId } from '../services/user.service.js'

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
            error: 'USER_NOT_FOUND',
            message: '유저 조회 실패',
          })
        }

        if (user.us_status === 'DISABLED') {
          const disabledAt = moment(user.disabled_at).startOf('day')
          const now = moment().startOf('day')
          const diff = moment.duration(now.diff(disabledAt)).asDays()

          if (diff < 7) {
            return cb(null, false, {
              statusCode: 403,
              error: 'DISABLED_USER',
              message: '비활성화된 유저',
            })
          } else {
            return cb(null, false, {
              statusCode: 404,
              error: 'USER_NOT_FOUND',
              message: '유저 조회 실패',
            })
          }
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
            error: 'USER_NOT_FOUND',
            message: '유저 조회 실패',
          })
        }

        if (user.us_status === 'DISABLED') {
          const disabledAt = moment(user.disabled_at).startOf('day')
          const now = moment().startOf('day')
          const diff = moment.duration(now.diff(disabledAt)).asDays()

          if (diff < 7) {
            return cb(null, false, {
              statusCode: 403,
              error: 'DISABLED_USER',
              message: '비활성화된 유저',
            })
          } else {
            return cb(null, false, {
              statusCode: 404,
              error: 'USER_NOT_FOUND',
              message: '유저 조회 실패',
            })
          }
        }

        const refreshToken = req.get('authorization').replace('Bearer ', '')

        const isMatch = await compare(refreshToken, user.us_token)

        if (!isMatch) {
          return cb(null, false, {
            statusCode: 401,
            error: 'EXPIRED_REFRESH_TOKEN',
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
        passwordField: 'type',
        passReqToCallback: true,
      },
      async function (req, id, type, cb) {
        const { sns_id, pwd } = req.body

        let user

        if (type === 'EMAIL') {
          user = await findUserById(id, type)
        } else {
          user = await findUserBySnsId(sns_id)
        }

        if (!user) {
          return cb(null, false, {
            statusCode: 404,
            error: 'USER_NOT_FOUND',
            message: '유저 조회 실패',
          })
        }

        if (user.us_status === 'DISABLED') {
          const disabledAt = moment(user.disabled_at).startOf('day')
          const now = moment().startOf('day')
          const diff = moment.duration(now.diff(disabledAt)).asDays()

          if (diff < 7) {
            return cb(null, false, {
              statusCode: 403,
              error: 'DISABLED_USER',
              message: '비활성화된 유저',
            })
          } else {
            return cb(null, false, {
              statusCode: 404,
              error: 'USER_NOT_FOUND',
              message: '유저 조회 실패',
            })
          }
        }

        if (type === 'EMAIL' && !(await compare(pwd, user.us_pwd))) {
          return cb(null, false, {
            statusCode: 401,
            error: 'UNAUTHORIZED_SIGN',
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
      error: 'UNAUTHORIZED_SIGN',
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
      error: 'EXPIRED_ACCESS_TOKEN',
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
      error: 'EXPIRED_REFRESH_TOKEN',
      message: '만료된 토근',
    })
  }
}
