import { PrismaClient } from '@prisma/client'
import { debug } from 'console'
const prisma = new PrismaClient()

export const getAllCustomers = async (req, res) => {
  try {
    const allCustomers = await prisma.user.findMany({
      where: {
        role: 'CUST',
      },
    })
    debug('all customers\n', allCustomers)
    res.send(allCustomers)
  } catch (error) {
    // res.status(500)
    debug('ERROR GETTING CUSTOMERS LIST', error)
  }
}
