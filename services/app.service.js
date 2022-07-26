import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient()

export const findVersion = async (os) => {
  return await prisma.version.findFirst({
    where: {
      vs_os: os,
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

export const createVersion = async (os, version, force) => {
  await prisma.version.create({
    data: {
      vs_os: os,
      vs_version: version,
      vs_force: force,
    },
  })
}
