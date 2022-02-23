import {
  findShopByLocation,
  findShopByKeyword,
  findOneShop,
} from '../services/shop.service.js'

export const shopList = async (req, res) => {
  const { type, keyword, longitude, latitude, category, radius } = req.query

  if (type === 'LOCATION') {
    const shop = await findShopByLocation(longitude, latitude, category, radius)

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
  }
}

export const shopDetail = async (req, res) => {
  const { user, params } = req
  const { sh_no } = params

  const shop = await findOneShop(sh_no)

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
}

export const shopSearch = async (req, res) => {
  return res
    .status(200)
    .json({ statusCode: 200, message: '와인샵 검색 성공', data: shop })
}
