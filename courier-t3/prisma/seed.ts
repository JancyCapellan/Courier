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
  console.log('✅ ~ file: seed.ts ~ line 24 ~ main ~ testUsers', testUsers)

  // const testProducts = await prisma.product.createMany({
  //   data: [
  //     {
  //       name: 'Box of used clothes',
  //       price: 10000, //10000 cents == $100
  //       type: 'BOX',
  //     },
  //     {
  //       name: 'Box of New clothes',
  //       price: 15000,
  //       type: 'BOX',
  //     },
  //   ],
  // })

  // add products from stripe is available to DB, hopefully sync issues dont happen if for some reason a product has a different stripe productID/priceID in DB than stripe db
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
