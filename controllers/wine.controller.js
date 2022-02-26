import {
  createUserWine,
  deleteUserWine,
  findOneUserWine,
  findWineByKeyword,
} from '../services/wine.service.js'
import moment from 'moment'

export const wineList = async (req, res) => {
  const { keyword } = req.query

  const wine = await findWineByKeyword(keyword)

  if (!wine) {
    return res.status(404).json({
      statusCode: 404,
      error: 'NOT_FOUND',
      message: '와인 조회 실패',
    })
  }

  return res
    .status(200)
    .json({ statusCode: 200, message: '와인 조회 성공', data: wine })
}

export const wineAdd = async (req, res) => {
  const { user, body } = req
  const { sh_no, wn_no, name, country, vintage, purchased_at } = body

  await createUserWine(user.us_no, sh_no, wn_no, {
    uw_name: name,
    uw_country: country,
    uw_vintage: vintage,
    purchased_at: moment(purchased_at).utc().toDate(),
  })

  return res.status(201).json({ statusCode: 200, message: '와인 등록 성공' })
}

export const wineDelete = async (req, res) => {
  const { user, body } = req
  const { uw_no } = body

  if (!(await findOneUserWine(user.us_no, uw_no))) {
    return res.status(404).json({
      statusCode: 404,
      error: 'NOT_FOUND',
      message: '와인 삭제 실패',
    })
  }

  await deleteUserWine(uw_no)

  return res.status(201).json({ statusCode: 200, message: '와인 삭제 성공' })
}
