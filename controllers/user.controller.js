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
  findBookmarkShopByNo,
  countBookmarkShopByNo,
  findUserInfo,
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
        error: 'UNAUTHORIZED_SIGN',
        message: '취향 업데이트 실패',
      })
    }

    try {
      await updateTaste(user.us_no, data.taste_type, data.taste_data)
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        statusCode: 500,
        error: 'DATA_ERROR',
        message: '데이터 처리 실패',
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

      // if (diff < 7) {
      //   return res.status(403).json({
      //     statusCode: 403,
      //     error: 'DISABLED_USER',
      //     message: '비활성화된 유저',
      //   })
      // }
    }

    if (data.nick && (await checkNick(data.nick))) {
      data.nick = data.nick + '-' + generate({ length: 5, charset: 'numeric' })
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
      return res.status(500).json({
        statusCode: 500,
        error: 'DATA_ERROR',
        message: '데이터 처리 실패',
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
      uw_price_range: true,
      purchased_at: true,
      shop: {
        select: {
          sh_no: true,
          sh_name: true,
          sh_category: true,
          sh_url: true,
          sh_time: true,
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
          wn_img: true,
          wn_category: true,
        },
      },
    },
  })

  for (let i = 0; i < _wine.length; i++) {
    if (i === limit) {
      next = true
      break
    }

    wineList.push({
      ..._wine[i],
      wine: {
        ..._wine[i].wine,
        wn_img:
          _wine[i].wine && _wine[i].wine.wn_img
            ? _wine[i].wine.wn_img
            : 'http://image.toast.com/aaaacby/wft/empty/empty_85x160.png',
      },
    })
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
      message: '다녀온 와인샵 리스트 조회 성공',
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
          sh_url: true,
          sh_time: true,
          sh_img: true,
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
    shopList.push({
      ..._shop[i],
      shop: {
        ..._shop[i].shop,
        sh_img:
          _shop[i].shop && _shop[i].shop.sh_img
            ? _shop[i].shop.sh_img
            : 'http://image.toast.com/aaaacby/wft/empty/empty_80x80.png',
      },
    })
  }

  return res.status(200).json({
    statusCode: 200,
    message: '다녀온 와인샵 리스트 조회 성공',
    data: {
      count: shopCnt,
      next: next,
      list: shopList,
    },
  })
}

export const userBookmark = async (req, res) => {
  const { limit, user, skip, take } = list(req)

  const shopCnt = await countBookmarkShopByNo(user.us_no)

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
  const _shop = await findBookmarkShopByNo(user.us_no, {
    skip: skip,
    take: take,
    select: {
      shop: {
        select: {
          sh_no: true,
          sh_name: true,
          sh_category: true,
          sh_url: true,
          sh_time: true,
          sh_img: true,
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
    shopList.push({
      ..._shop[i],
      shop: {
        ..._shop[i].shop,
        sh_img:
          _shop[i].shop && _shop[i].shop.sh_img
            ? _shop[i].shop.sh_img
            : 'http://image.toast.com/aaaacby/wft/empty/empty_80x80.png',
      },
    })
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

  const userInfo = await findUserInfo(user.us_no)

  const wineData = []
  const _wine = await findWineByNo(user.us_no, {
    select: {
      uw_no: true,
      uw_name: true,
      uw_country: true,
      uw_vintage: true,
      uw_price_range: true,
      purchased_at: true,
      shop: {
        select: {
          sh_no: true,
          sh_name: true,
          sh_category: true,
          sh_url: true,
          sh_time: true,
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
          wn_img: true,
          wn_category: true,
        },
      },
    },
  })
  _wine.map((wine) => {
    wineData.push({
      ...wine,
      wine: {
        ...wine.wine,
        wn_img:
          wine.wine && wine.wine.wn_img
            ? wine.wine.wn_img
            : 'http://image.toast.com/aaaacby/wft/empty/empty_105x105.png',
      },
    })
  })

  const wine = {
    count: await countWineByNo(user.us_no),
    data: wineData,
  }

  const shopData = []
  const _shop = await findShopByNo(user.us_no, {
    select: {
      shop: {
        select: {
          sh_no: true,
          sh_name: true,
          sh_category: true,
          sh_url: true,
          sh_time: true,
          sh_img: true,
        },
      },
      uh_bookmark: true,
      uh_wine_cnt: true,
    },
  })
  _shop.map((shop) => {
    shopData.push({
      ...shop,
      shop: {
        ...shop.shop,
        sh_img:
          shop.shop && shop.shop.sh_img
            ? shop.shop.sh_img
            : 'http://image.toast.com/aaaacby/wft/empty/empty_160x82.png',
      },
    })
  })

  const shop = {
    count: await countShopByNo(user.us_no),
    data: shopData,
  }

  const bookmarkData = []
  const _bookmark = await findBookmarkShopByNo(user.us_no, {
    select: {
      shop: {
        select: {
          sh_no: true,
          sh_name: true,
          sh_category: true,
          sh_url: true,
          sh_time: true,
          sh_img: true,
        },
      },
      uh_bookmark: true,
      uh_wine_cnt: true,
    },
  })
  _bookmark.map((bookmark) => {
    bookmarkData.push({
      ...bookmark,
      shop: {
        ...bookmark.shop,
        sh_img:
          bookmark.shop && bookmark.shop.sh_img
            ? bookmark.shop.sh_img
            : 'http://image.toast.com/aaaacby/wft/empty/empty_160x82.png',
      },
    })
  })

  const bookmark = {
    count: await countBookmarkShopByNo(user.us_no),
    data: bookmarkData,
  }

  return res.status(200).json({
    statusCode: 200,
    message: '마이페이지 조회 성공',
    data: {
      user: userInfo,
      wine: wine,
      shop: shop,
      bookmark: bookmark,
    },
  })
}
