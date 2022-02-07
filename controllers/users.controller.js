import { compare } from 'bcrypt'
import moment from 'moment'

import {
  createEmailUser,
  createSnsUser,
  findUserById,
  findUserBySnsId,
  checkNick,
  updateTaste,
} from '../services/users.service.js'

export const signUp = async (req, res, next) => {
  const { id, pwd, sns_id, type, ...data } = req.body

  let user

  if (type === 'EMAIL') {
    user = await findUserById(id, type)
  } else {
    user = await findUserBySnsId(sns_id)
  }

  if (!user) {
    if (data.nick && (await checkNick(data.nick))) {
      return res.status(409).json({
        statusCode: 409,
        error: 'CONFLICT_NICK',
        message: '닉네임 중복',
      })
    }

    const tempData = {}

    const add = (target, source) => {
      source && (tempData[target] = source)
    }

    add('us_birthday', moment(data.birthday).utc().toDate())
    add('us_nick', data.nick)
    add('us_age', data.age)
    add('us_gender', data.gender)
    add('taste_type', data.taste_type)
    add('taste_data', data.taste_data)

    try {
      if (type === 'EMAIL') {
        await createEmailUser(id, pwd, tempData)
      } else {
        await createSnsUser(id, pwd, type, tempData)
      }
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        statusCode: 400,
        error: 'REQUEST_ERROR',
        message: '잘못된 요청',
      })
    }

    return res.status(201).json({
      statusCode: 201,
      message: '회원가입 성공',
    })
  } else {
    if (type === 'EMAIL' && !(await compare(pwd, user.us_pwd))) {
      return res.status(401).json({
        statusCode: 401,
        error: 'SignUnauthorized',
        message: '취향 업데이트 실패',
      })
    }

    try {
      await updateTaste(user.us_no, data.taste_type, data.taste_data)
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        statusCode: 400,
        error: 'REQUEST_ERROR',
        message: '잘못된 요청',
      })
    }

    return res.status(201).json({
      statusCode: 201,
      message: '취향 업데이트 성공',
    })
  }
}
