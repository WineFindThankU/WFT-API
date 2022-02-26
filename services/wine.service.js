import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import { toUniCode } from '../utils/text.js'

export const createUserWine = async (us_no, sh_no, wn_no, datas = {}) => {
  if (wn_no) {
    return await prisma.userWine.create({
      data: {
        user: {
          connect: {
            us_no: us_no,
          },
        },
        shop: {
          connect: {
            sh_no: sh_no,
          },
        },
        wine: {
          connect: {
            wn_no: wn_no,
          },
        },
        ...datas,
      },
    })
  } else {
    return await prisma.userWine.create({
      data: {
        user: {
          connect: {
            us_no: us_no,
          },
        },
        shop: {
          connect: {
            sh_no: sh_no,
          },
        },
        ...datas,
      },
    })
  }
}

export const findOneUserWine = async (us_no, uw_no) => {
  return await prisma.userWine.findFirst({
    where: {
      us_no: us_no,
      uw_no: uw_no,
    },
  })
}

export const deleteUserWine = async (uw_no) => {
  return await prisma.userWine.delete({
    where: {
      uw_no: uw_no,
    },
  })
}
