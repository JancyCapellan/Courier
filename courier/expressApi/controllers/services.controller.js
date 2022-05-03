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
  try {
    debug(req.body)
    const item_name = req.body.item_name
    const item_price = req.body.item_price
    const item_type = req.body.item_type
    const newitem = await prisma.product.create({
      data: {
        name: item_name,
        price: item_price,
        type: item_type,
      },
    })

    res.json(newitem)
  } catch (error) {
    debug('add item error', error)
    res.status(500).send('error adding item')
  }
}

exports.productTypes = async (req, res) => {
  try {
    const types = await prisma.productType.findMany({})
    // console.log('types', types)
    res.send(types)
  } catch (error) {
    debug(error)
  }
}
