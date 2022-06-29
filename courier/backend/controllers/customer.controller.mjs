import { PrismaClient } from '@prisma/client'
import { debug } from 'console'
const prisma = new PrismaClient()

export const getAllCustomers = async (req, res) => {
  const skip = parseInt(req.query.offset)
  const take = parseInt(req.query.limit)
  // debug('query:', req)
  try {
    const allCustomers = await prisma.user.findMany({
      skip: skip,
      take: take,
      where: {
        role: 'CUSTOMER',
      },
    })
    const customerTableCount = await prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    })
    // debug('all customers\n', allCustomers)
    res.send({ currentCustomerPage: allCustomers, customerTableCount: customerTableCount })
  } catch (error) {
    // res.status(500)
    debug('ERROR GETTING CUSTOMERS LIST', error)
  }
}

export const addManyCustomers = async (req, res) => {
  const customerList = req.body
  try {
    const result = await prisma.user.createMany({
      data: customerList,
    })
    debug('added customers', result)
    res.json(result)
  } catch (error) {
    debug('error with bulk customer insert', error)
  }
}

export const getHello = async (req, res) => {
  res.json('hello')
}
