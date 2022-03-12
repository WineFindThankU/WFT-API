import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import { hash } from 'bcrypt'

export const createEmailUser = async (id, pwd, data) => {
  await prisma.user.create({
    data: {
      us_id: id,
      us_pwd: await hash(pwd, 10),
      ...data,
    },
  })
}

export const createSnsUser = async (id, sns_id, us_type, data) => {
  await prisma.user.create({
    data: {
      us_id: id,
      us_sns_id: sns_id,
      us_type: us_type,
      ...data,
    },
  })
}

export const findUserBySnsId = async (sns_id) => {
  return await prisma.user.findFirst({
    where: {
      us_sns_id: sns_id,
    },
    orderBy: [
      {
        us_status: 'asc',
      },
      {
        created_at: 'desc',
      },
    ],
  })
}

export const findUserById = async (id, type) => {
  return await prisma.user.findFirst({
    where: {
      us_id: id,
      us_type: type,
    },
    orderBy: [
      {
        us_status: 'asc',
      },
      {
        created_at: 'desc',
      },
    ],
  })
}

export const findUserByNo = async (no) => {
  return await prisma.user.findUnique({
    where: {
      us_no: no,
    },
  })
}

export const checkNick = async (nick) => {
  const user = await prisma.user.findUnique({
    where: {
      us_nick: nick,
    },
  })

  return user ? true : false
}

export const updateRefreshToken = async (no, refreshToken) => {
  const hashRefreshToken = await hash(refreshToken, 10)
  await prisma.user.update({
    where: {
      us_no: no,
    },
    data: {
      us_token: hashRefreshToken,
    },
  })
}

export const updateTaste = async (no, type, data) => {
  await prisma.user.update({
    where: {
      us_no: no,
    },
    data: {
      taste_type: type,
      taste_data: data,
    },
  })
}

export const deleteRefreshToken = async (no) => {
  await prisma.user.update({
    where: {
      us_no: no,
    },
    data: {
      us_token: null,
    },
  })
}

export const disableUser = async (no) => {
  await prisma.user.update({
    where: {
      us_no: no,
    },
    data: {
      us_status: 'DISABLED',
      disabled_at: new Date(),
    },
  })
}

export const findWineByNo = async (us_no, options = {}) => {
  return await prisma.userWine.findMany({
    where: {
      us_no: us_no,
      uw_disabled: false,
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    ...options,
  })
}

export const countWineByNo = async (us_no, options = {}) => {
  return await prisma.userWine.count({
    where: {
      us_no: us_no,
      uw_disabled: false,
    },
    ...options,
  })
}

export const findShopByNo = async (us_no, options = {}) => {
  return await prisma.userShop.findMany({
    where: {
      us_no: us_no,
      uh_wine_cnt: {
        gt: 1,
      },
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    ...options,
  })
}

export const countShopByNo = async (us_no, options = {}) => {
  return await prisma.userShop.count({
    where: {
      us_no: us_no,
      uh_wine_cnt: {
        gt: 1,
      },
    },
    ...options,
  })
}

export const findBookmarkShopByNo = async (us_no, options = {}) => {
  return await prisma.userShop.findMany({
    where: {
      us_no: us_no,
      uh_bookmark: true,
    },
    orderBy: [
      {
        created_at: 'desc',
      },
    ],
    ...options,
  })
}

export const countBookmarkShopByNo = async (us_no, options = {}) => {
  return await prisma.userShop.count({
    where: {
      us_no: us_no,
      uh_bookmark: true,
    },
    ...options,
  })
}

export const findUserInfo = async (us_no) => {
  return await prisma.user.findUnique({
    where: { us_no: us_no },
    select: {
      us_id: true,
      us_nick: true,
      taste_type: true,
    },
  })
}
