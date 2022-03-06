import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import { toUniCode } from '../utils/text.js'

export const createUserWine = async (us_no, sh_no, wn_no, datas = {}) => {
  const createUserWine = wn_no
    ? prisma.userWine.create({
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
    : prisma.userWine.create({
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

  const upUserShopWineCnt = prisma.userShop.upsert({
    where: {
      us_no_sh_no: {
        us_no: us_no,
        sh_no: sh_no,
      },
    },
    update: {
      uh_wine_cnt: {
        increment: 1,
      },
    },
    create: {
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
      uh_wine_cnt: 1,
    },
  })

  await prisma.$transaction([createUserWine, upUserShopWineCnt])
}

export const findOneUserWine = async (us_no, uw_no) => {
  return await prisma.userWine.findFirst({
    where: {
      us_no: us_no,
      uw_no: uw_no,
    },
  })
}

export const deleteUserWine = async (us_no, sh_no, uw_no) => {
  const deleteUserWine = prisma.userWine.delete({
    where: {
      uw_no: uw_no,
    },
  })

  const downUserShopWineCnt = prisma.userShop.upsert({
    where: {
      us_no_sh_no: {
        us_no: us_no,
        sh_no: sh_no,
      },
    },
    update: {
      uh_wine_cnt: {
        decrement: 1,
      },
    },
    create: {
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
      uh_wine_cnt: 0,
    },
  })

  await prisma.$transaction([deleteUserWine, downUserShopWineCnt])
}

export const findWineByKeyword = async (keyword) => {
  const _keyword = '%' + toUniCode(keyword).replaceAll('\\', '\\\\') + '%'

  const query =
    await prisma.$queryRaw`SELECT wn.wn_no FROM tb_wine AS wn WHERE wn.wn_name_uni LIKE ${_keyword}`

  return await prisma.wine.findMany({
    where: {
      wn_no: {
        in: query.map(({ wn_no }) => wn_no),
      },
    },
    select: {
      wn_no: true,
      wn_brand: true,
      wn_name: true,
      wn_name_en: true,
      wn_country: true,
      wn_nation: true,
      wn_kind: true,
      wn_alcohol: true,
      wn_img: true,
    },
  })
}
