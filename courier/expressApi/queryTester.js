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

  // const result = await prisma.user.findFirst({
  //   where: {
  //     email: 'jancycapellan97@gmail.com',
  //     password: '123',
  //   },
  //   select: {
  //     id: true,
  //     firstName: true,
  //     lastName: true,
  //     role: true,
  //     preferredLanguage: true,
  //     email: false,
  //   },
  // })

  // const result = await prisma.user.findFirst({
  //   where: {
  //     AND: [
  //       {
  //         email: 'fish',
  //       },
  //       {
  //         password: '123',
  //       },
  //     ],
  //   },
  // })
  // console.log(result)

  // const updateUser = await prisma.user.update({
  //   where: {
  //     email: 'jessyjones@email.com',
  //   },
  //   data: {
  //     role: 'SECT',
  //   },
  // })

  // console.log('updated user', updateUser)

  let search = 'jancy'
  // const result = await prisma.user.findMany({
  //   where: {
  //     OR: [
  //       {
  //         email: {
  //           contains: search,
  //         },
  //       },
  //       {
  //         firstName: {
  //           contains: search,
  //         },
  //       },
  //       {
  //         lastName: {
  //           contains: search,
  //         },
  //       },
  //       // {
  //       //   id: {
  //       //     contains: {},
  //       //   },
  //       // },
  //     ],
  //   },
  // })
  // console.log(result)
  const result = await prisma.user.findMany({})
  console.log('results', result)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
