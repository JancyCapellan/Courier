import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const testUsers = await prisma.user.createMany({
    data: [
      {
        email: 'ADMIN@email.com',
        firstName: 'ADMININSTRATOR',
        lastName: 'ADMIN',
        role: 'ADMIN',
        // password: 'gW3H5mg2#!dWjcgd#*@L',
        password: 'admin123',
      },
      {
        email: 'CustomerTester@email.com',
        firstName: 'Customer',
        lastName: 'Tester',
        role: 'CUSTOMER',
        password: '123',
      },
    ],
  })

  const testProductTypes = await prisma.productType.createMany({
    data: [
      {
        type: 'BOX',
      },
      {
        type: 'TANK',
      },
      {
        type: 'MISC',
      },
    ],
  })

  const testProducts = await prisma.product.createMany({
    data: [
      {
        name: 'Box of used clothes',
        price: 100,
        type: 'BOX',
      },
    ],
  })
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
