import {
  findShopByLocation,
  findShopByKeyword,
  findShop,
  findOneShop,
  findOneUserShop,
  updateShopBookmark,
} from '../services/shop.service.js'

export const shopList = async (req, res) => {
  const { type, keyword, longitude, latitude, category, radius } = req.query

  if (type === 'LOCATION') {
    const shop = await findShopByLocation(longitude, latitude, category, radius)

    if (!shop) {
      return res
        .status(200)
        .json({ statusCode: 200, message: '와인샵 조회 실패', data: [] })
    }

    return res
      .status(200)
      .json({ statusCode: 200, message: '와인샵 조회 성공', data: shop })
  } else if (type === 'KEYWORD') {
    const shop = await findShopByKeyword(keyword)

    if (!shop) {
      return res.status(404).json({
        statusCode: 404,
        error: 'NOT_FOUND',
        message: '와인샵 조회 실패',
      })
    }

    return res
      .status(200)
      .json({ statusCode: 200, message: '와인샵 조회 성공', data: shop })
  } else {
    const shop = await findShop()

    if (!shop) {
      return res
        .status(200)
        .json({ statusCode: 200, message: '와인샵 조회 실패', data: [] })
    }

    return res
      .status(200)
      .json({ statusCode: 200, message: '와인샵 조회 성공', data: shop })
  }
}

export const shopDetail = async (req, res) => {
  const { user, params } = req
  const { sh_no } = params

  let shop = await findOneShop(sh_no)

  if (!shop) {
    return res.status(404).json({
      statusCode: 404,
      error: 'NOT_FOUND',
      message: '와인샵 조회 실패',
    })
  }

  const userShop = await findOneUserShop(user.us_no, sh_no)

  const userWines = []
  shop.userWines.map((userWine) => {
    userWines.push({
      ...userWine,
      wine: {
        ...userWine.wine,
        wn_img:
          userWine.wine && userWine.wine.wn_img
            ? userWine.wine.wn_img
            : 'http://image.toast.com/aaaacby/wft/empty/empty_105x147.png',
      },
    })
  })

  shop = {
    ...shop,
    userWines: userWines,
    sh_bookmark: userShop ? userShop.uh_bookmark : false,
  }

  return res
    .status(200)
    .json({ statusCode: 200, message: '와인샵 조회 성공', data: shop })
}

export const shopBookmark = async (req, res) => {
  const { user, params, body } = req
  const { bookmark } = body
  const { sh_no } = params

  await updateShopBookmark(user.us_no, sh_no, bookmark)

  return res
    .status(201)
    .json({ statusCode: 201, message: '와인샵 즐겨찾기 성공' })
}

export const shopWineWrite = async (req, res) => {}
