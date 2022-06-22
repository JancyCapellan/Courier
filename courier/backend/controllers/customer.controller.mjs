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
        role: 'CUST',
      },
    })
    const customerTableCount = await prisma.user.count({
      where: {
        role: 'CUST',
      },
    })
    // debug('all customers\n', allCustomers)
    res.send({ currentCustomerPage: allCustomers, customerTableCount: customerTableCount })
  } catch (error) {
    // res.status(500)
    debug('ERROR GETTING CUSTOMERS LIST', error)
  }
}
