import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import { toUniCode } from '../utils/text.js'

export const findShopByLocation = async (
  longitude,
  latitude,
  category,
  radius = 10,
) => {
  const _longitude = parseFloat(longitude)
  const _latitude = parseFloat(latitude)
  const _radius = parseInt(radius)

  const query = await (category
    ? prisma.$queryRaw`SELECT sh.sh_no FROM tb_shop AS sh WHERE ST_DWithin(ST_MakePoint(sh.sh_longitude, sh.sh_latitude), ST_MakePoint(${_longitude}, ${_latitude})::geography, ${_radius} * 1000) AND sh.sh_category = ${category}`
    : prisma.$queryRaw`SELECT sh.sh_no FROM tb_shop AS sh WHERE ST_DWithin(ST_MakePoint(sh.sh_longitude, sh.sh_latitude), ST_MakePoint(${_longitude}, ${_latitude})::geography, ${_radius} * 1000)`)

  return await prisma.shop.findMany({
    where: {
      sh_no: {
        in: query.map(({ sh_no }) => sh_no),
      },
    },
    select: {
      sh_no: true,
      sh_name: true,
      sh_category: true,
      sh_address: true,
      sh_tell: true,
      sh_url: true,
    },
  })
}

export const findShop = async () => {
  return await prisma.shop.findMany({
    select: {
      sh_no: true,
      sh_name: true,
      sh_category: true,
      sh_address: true,
      sh_tell: true,
      sh_url: true,
    },
  })
}

export const findShopByKeyword = async (keyword) => {
  const _keyword = '%' + keyword + '%'

  const query =
    await prisma.$queryRaw`SELECT sh.sh_no FROM tb_shop AS sh LEFT JOIN tb_dong AS dg ON sh.sh_dong = dg.do_no WHERE sh.sh_name LIKE ${_keyword} OR dg.do_full LIKE ${_keyword}`

  return await prisma.shop.findMany({
    where: {
      sh_no: {
        in: query.map(({ sh_no }) => sh_no),
      },
    },
    select: {
      sh_no: true,
      sh_name: true,
      sh_category: true,
      sh_address: true,
      sh_tell: true,
      sh_url: true,
    },
  })
}

export const findOneShop = async (sh_no) => {
  return await prisma.shop.findUnique({
    where: { sh_no: sh_no },
    select: {
      sh_no: true,
      sh_name: true,
      sh_category: true,
      sh_address: true,
      sh_tell: true,
      sh_url: true,
    },
  })
}

export const findOneUserShop = async (us_no, sh_no) => {
  return await prisma.userShop.findUnique({
    where: {
      us_no_sh_no: {
        us_no: us_no,
        sh_no: sh_no,
      },
    },
  })
}

export const createUserShop = async (us_no, sh_no, datas = {}) => {
  return await prisma.userShop.create({
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

export const updateUserShop = async (us_no, sh_no, datas = {}) => {
  return await prisma.userShop.update({
    where: {
      us_no_sh_no: {
        us_no: us_no,
        sh_no: sh_no,
      },
    },
    data: {
      ...datas,
    },
  })
}

export const updateShopBookmark = async (us_no, sh_no, bookmark) => {
  const userShop = await findOneUserShop(us_no, sh_no)

  if (userShop) {
    await updateUserShop(us_no, sh_no, { uh_bookmark: bookmark })
  } else {
    await createUserShop(us_no, sh_no, { uh_bookmark: bookmark })
  }
}
