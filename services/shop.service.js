import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

export const findShop = async (longitude, latitude, radius = 10) => {
  const _longitude = parseFloat(longitude)
  const _latitude = parseFloat(latitude)

  const query =
    await prisma.$queryRaw`SELECT sh.sh_no FROM tb_shop AS sh WHERE ST_DWithin(ST_MakePoint(sh.sh_longitude, sh.sh_latitude), ST_MakePoint(${_longitude}, ${_latitude})::geography, ${radius} * 1000)`

  return await prisma.shop.findMany({
    where: {
      sh_no: {
        in: query.forEach(({ sh_no }) => sh_no),
      },
    },
    select: {
      sh_no: true,
      sh_name: true,
      sh_category: true,
      sh_address: true,
      sh_tell: true,
      sh_url: true,
      sh_longitude: false,
      sh_latitude: false,
      created_at: false,
      updated_at: false,
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
      sh_longitude: false,
      sh_latitude: false,
      created_at: false,
      updated_at: false,
    },
  })
}
