import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()
import moment from 'moment'

prisma.user
  .findMany({
    where: {
      us_status: 'DISABLED',
      disabled_at: {
        lt: moment().startOf('day').subtract(30, 'days').toDate(),
      },
    },
  })
  .then((users) => {
    users.map(async ({ us_no }) => {
      try {
        await prisma.user.update({
          where: {
            us_no: us_no,
          },
          data: {
            qnas: {
              deleteMany: {},
            },
            userShops: {
              deleteMany: {},
            },
            userWines: {
              set: [],
            },
          },
          include: {
            userWines: true,
          },
        })
      } catch (e) {}
    })

    prisma.user
      .deleteMany({
        where: {
          us_status: 'DISABLED',
          disabled_at: {
            lt: moment().startOf('day').subtract(30, 'days').toDate(),
          },
        },
      })
      .then(() => {
        console.log('비활성화 유저 삭제 성공')
      })
      .catch((e) => {
        console.log(e)
      })
  })
  .catch((e) => {
    console.log(e)
  })
