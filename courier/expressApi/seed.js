const { PrismaClient } = require('@prisma/client')
const { spanish } = require('../assests/products.json')
const prisma = new PrismaClient()

async function main() {
  // let types = [{ type: 'BOX' }, { type: 'TANK' }, { type: 'MISC' }]
  // const result = await prisma.productType.createMany({
  //   data: types,
  // })

  const result = await prisma.product.createMany({
    data: spanish,
  })

  console.log('results', result)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
