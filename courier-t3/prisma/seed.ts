import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const userADMIN = await prisma.user.create({
    data: {
      email: 'ADMIN@email.com',
      firstName: 'ADMININSTRATOR',
      lastName: 'ADMIN',
      role: 'ADMIN',
      password: 'gW3H5mg2#!dWjcgd#*@L',
    },
  })
  const userTestCustomer = await prisma.user.create({
    data: {
      email: 'CustomerTester@email.com',
      firstName: 'Customer',
      lastName: 'Tester',
      role: 'CUSTOMER',
      password: '123',
    },
  })
  console.log({ userADMIN, userTestCustomer })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
