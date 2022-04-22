const { PrismaClient } = require('@prisma/client')
const { debug } = require('console')
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

exports.addItem = async (req, res) => {
  debug(req.body)
}
