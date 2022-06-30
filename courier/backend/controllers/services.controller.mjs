import { PrismaClient } from '@prisma/client'
import { debug } from 'console'
const prisma = new PrismaClient()

export const allProducts = async (req, res) => {
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
  debug(products)
  res.json(products)
}

export const addItem = async (req, res) => {
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

export const addProductType = async (req, res) => {
  const newType = req.body.new_type
  try {
    const addedType = await prisma.productType.create({ data: { type: newType } })
    debug(addedType)
    res.json(addedType)
  } catch (error) {}
}

export const productTypes = async (req, res) => {
  try {
    const types = await prisma.productType.findMany({})

    // logic to turn type object into key/value pair for select options
    function renameKey(obj, oldKey, newKey) {
      obj[newKey] = obj[oldKey]
      delete obj[oldKey]
    }

    types.forEach((type) => {
      renameKey(type, 'id', 'value')
      renameKey(type, 'type', 'key')
    })

    // add to from of array, first option, front end validation requires first value to be 0 if you want it to give please select type error in current form
    types.unshift({ value: 0, key: 'select type' })

    res.send(types)
  } catch (error) {
    debug(error)
  }
}

export const deleteProductType = async (req, res) => {
  const typeId = parseInt(req.params.typeId)
  try {
    const deletedType = await prisma.productType.delete({
      where: {
        id: typeId,
      },
    })
    debug('deleted type', deletedType)
    res.send('type successfully deleted')
  } catch (error) {
    // debug(error)
    res.status(500)
    res.send('error: possibly due to a product of this type existing on database')
  }
}