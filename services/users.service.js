import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import { hash } from 'bcrypt'

export const createEmailUser = async (id, pwd) => {
  try {
    await prisma.user.create({
      data: {
        us_id: id,
        us_pwd: await hash(pwd, 10),
      },
    })
  } catch (e) {
    console.log(e)
  }
}

export const createSnsUser = async (id, sns_id, regist_type) => {
  try {
    await prisma.user.create({
      data: {
        us_id: id,
        us_sns_id: await hash(sns_id, 10),
        regist_type: regist_type,
      },
    })
  } catch (e) {
    console.log(e)
  }
}

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      us_id: id,
    },
  })
}

export const findUserByNo = async (no) => {
  return await prisma.user.findUnique({
    where: {
      us_no: no,
    },
  })
}

export const updateRefreshToken = async (id, refreshToken) => {
  const hashRefreshToken = await hash(refreshToken, 10)
  await prisma.user.update({
    where: {
      us_id: id,
    },
    data: {
      refresh_token: hashRefreshToken,
    },
  })
}
