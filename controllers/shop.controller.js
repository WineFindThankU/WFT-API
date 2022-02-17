import { findShop, findOneShop } from '../services/shop.service.js'

export const shopList = async (req, res) => {
  const { longitude, latitude, radius } = req.query

  const shop = await (radius
    ? findShop(longitude, latitude, radius)
    : findShop(longitude, latitude))

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
