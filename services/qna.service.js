import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

export const findQnaByNo = async (us_no, options = {}) => {
  return await prisma.qna.findMany({
    where: {
      us_no: us_no,
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    ...options,
  })
}

export const findOneQnaByNo = async (us_no, qa_no) => {
  return await prisma.qna.findFirst({
    where: {
      us_no: us_no,
      qa_no: qa_no,
    },
  })
}

export const countQnaByNo = async (us_no, options = {}) => {
  return await prisma.qna.count({
    where: {
      us_no: us_no,
    },
    ...options,
  })
}

export const createQna = async (us_no, email, title, content) => {
  await prisma.user.update({
    where: { us_no: us_no },
    data: {
      qnas: {
        create: {
          qa_email: email,
          qa_title: title,
          qa_content: content,
        },
      },
    },
  })
}
