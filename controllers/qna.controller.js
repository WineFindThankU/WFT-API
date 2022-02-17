import { list } from '../utils/func.js'
import {
  findQnaByNo,
  findOneQnaByNo,
  countQnaByNo,
  createQna,
} from '../services/qna.service.js'

export const qnaList = async (req, res) => {
  const { limit, user, skip, take } = list(req)

  const qnaCnt = await countQnaByNo(user.us_no)

  let next = false

  if (qnaCnt <= 0) {
    return res.status(200).json({
      statusCode: 200,
      message: '1:1문의 조회 성공',
      data: {
        count: qnaCnt,
        next: next,
        list: [],
      },
    })
  }

  const qnaList = []
  const _qna = await findQnaByNo(user.us_no, { skip: skip, take: take })

  for (let i = 0; i < _qna.length; i++) {
    if (i === limit) {
      next = true
      break
    }
    qnaList.push(_qna[i])
  }

  return res.status(200).json({
    statusCode: 200,
    message: '1:1문의 조회 성공',
    data: {
      count: qnaCnt,
      next: next,
      list: qnaList,
    },
  })
}

export const qnaDetail = async (req, res) => {
  const { user, params } = req
  const { qa_no } = params

  const qna = await findOneQnaByNo(user.us_no, qa_no)

  if (!qna) {
    return res
      .status(404)
      .json({
        statusCode: 404,
        error: 'NOT_FOUND',
        message: '1:1문의 조회 실패',
      })
  }

  return res
    .status(200)
    .json({ statusCode: 200, message: '1:1문의 조회 성공', data: qna })
}

export const qnaWrite = async (req, res) => {
  const { user, body } = req
  const { email, title, content } = body

  await createQna(user.us_no, email, title, content)

  return res.status(201).json({ statusCode: 201, message: '1:1문의 작성 완료' })
}
