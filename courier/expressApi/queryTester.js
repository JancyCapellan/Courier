const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here

  // const allUsers = await prisma.user.findMany()
  // console.log(allUsers)

  // const result = await prisma.user.create({
  //   data: {
  //     ...req.body,
  //   },
  // })

  const result = await prisma.user.findFirst({
    where: {
      email: 'jancycapellan97@gmail.com',
      password: '123',
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      preferredLanguage: true,
      email: false,
    },
  })
  console.log(result)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
