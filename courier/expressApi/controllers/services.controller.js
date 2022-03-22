const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.allProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      productType: {
        select: {
          type: true,
        },
      },
    },
  })
  res.json(products)
}
