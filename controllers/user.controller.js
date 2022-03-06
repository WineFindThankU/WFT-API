import { compare } from 'bcrypt'
import { generate } from 'randomstring'
import moment from 'moment'

import { list } from '../utils/func.js'
import {
  createEmailUser,
  createSnsUser,
  findUserById,
  findUserBySnsId,
  checkNick,
  updateTaste,
  disableUser,
  countWineByNo,
  findWineByNo,
  countShopByNo,
  findShopByNo,
} from '../services/user.service.js'

export const signUp = async (req, res) => {
  const { id, pwd, sns_id, type, ...data } = req.body

  let user

  if (type === 'EMAIL') {
    user = await findUserById(id, type)
  } else {
    user = await findUserBySnsId(sns_id)
  }

  if (user && user.us_status === 'ENABLED') {
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
  } else {
    if (user && user.us_status === 'DISABLED') {
      const disabledAt = moment(user.disabled_at).startOf('day')
      const now = moment().startOf('day')
      const diff = moment.duration(now.diff(disabledAt)).asDays()

      if (diff < 7) {
        return res.status(403).json({
          statusCode: 403,
          error: 'DISABLED_USER',
          message: '비활성화된 계정입니다',
        })
      }
    }

    if (data.nick && (await checkNick(data.nick))) {
      data.nick = '와린이-' + generate({ length: 5, charset: 'numeric' })
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
        await createSnsUser(id, sns_id, type, tempData)
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
  }
}

export const userDisable = async (req, res) => {
  const user = req.user

  await disableUser(user.us_no)

  return res.status(200).json({
    statusCode: 200,
    message: '회원탈퇴 성공',
  })
}

export const userWine = async (req, res) => {
  const { limit, user, skip, take } = list(req)

  const wineCnt = await countWineByNo(user.us_no)

  let next = false

  if (wineCnt <= 0) {
    return res.status(200).json({
      statusCode: 200,
      message: '구매 와인 리스트 조회 성공',
      data: {
        count: wineCnt,
        next: next,
        list: [],
      },
    })
  }

  const wineList = []
  const _wine = await findWineByNo(user.us_no, {
    skip: skip,
    take: take,
    select: {
      uw_no: true,
      uw_name: true,
      uw_country: true,
      uw_vintage: true,
      purchased_at: true,
      shop: {
        select: {
          sh_no: true,
          sh_name: true,
        },
      },
      wine: {
        select: {
          wn_no: true,
          wn_name: true,
          wn_name_en: true,
          wn_kind: true,
          wn_country: true,
          wn_alcohol: true,
        },
      },
    },
  })

  for (let i = 0; i < _wine.length; i++) {
    if (i === limit) {
      next = true
      break
    }
    wineList.push(_wine[i])
  }

  return res.status(200).json({
    statusCode: 200,
    message: '구매 와인 리스트 조회 성공',
    data: {
      count: wineCnt,
      next: next,
      list: wineList,
    },
  })
}

export const userShop = async (req, res) => {
  const { limit, user, skip, take } = list(req)

  const shopCnt = await countShopByNo(user.us_no)

  let next = false

  if (shopCnt <= 0) {
    return res.status(200).json({
      statusCode: 200,
      message: '즐겨찾기한 와인샵 리스트 조회 성공',
      data: {
        count: shopCnt,
        next: next,
        list: [],
      },
    })
  }

  const shopList = []
  const _shop = await findShopByNo(user.us_no, {
    skip: skip,
    take: take,
    select: {
      shop: {
        select: {
          sh_no: true,
          sh_name: true,
          sh_category: true,
        },
      },
      uh_bookmark: true,
      uh_wine_cnt: true,
    },
  })

  for (let i = 0; i < _shop.length; i++) {
    if (i === limit) {
      next = true
      break
    }
    shopList.push(_shop[i])
  }

  return res.status(200).json({
    statusCode: 200,
    message: '즐겨찾기한 와인샵 리스트 조회 성공',
    data: {
      count: shopCnt,
      next: next,
      list: shopList,
    },
  })
}

export const userInfo = async (req, res) => {
  const user = req.user

  return res.status(200).json({
    statusCode: 200,
    message: '마이페이지 조회 성공',
  })
}
