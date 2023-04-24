import { z } from 'zod'
import { createProtectedRouter } from './protected-routers'

export const customerRouter = createProtectedRouter()
  .query('getCustomerList', {
    input: z.object({
      queryPageIndex: z.number(),
      queryPageSize: z.number(),
    }),
    async resolve({ ctx, input }) {
      const skip = input.queryPageIndex
      const take = input.queryPageSize
      // debug('query:', req)
      try {
        const allCustomers = await ctx.prisma.user.findMany({
          skip: skip,
          take: take,
          where: {
            role: 'CUSTOMER',
          },
        })
        const customerTableCount = await ctx.prisma.user.count({
          where: {
            role: 'CUSTOMER',
          },
        })
        // debug('all customers\n', allCustomers)
        return {
          currentCustomerPage: allCustomers,
          customerTableCount: customerTableCount,
        }
      } catch (error) {
        // res.status(500)
        console.error('ERROR GETTING CUSTOMERS LIST', error)
      }
    },
  })
  .query('getAllCustomers', {
    async resolve({ ctx, input }) {
      // debug('query:', req)
      try {
        const allCustomers = await ctx.prisma.user.findMany({
          where: {
            role: 'CUSTOMER',
          },
        })
        const customerTableCount = await ctx.prisma.user.count({
          where: {
            role: 'CUSTOMER',
          },
        })
        // debug('all customers\n', allCustomers)
        return {
          currentCustomerPage: allCustomers,
          customerTableCount: customerTableCount,
        }
      } catch (error) {
        // res.status(500)
        console.error('ERROR GETTING CUSTOMERS LIST', error)
      }
    },
  })
  .mutation('editUserInformation', {
    input: z.object({
      userId: z.string(),
      form: z.object({
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        role: z.enum(['CUSTOMER', 'ADMIN']), //TODO: TYPEDEF
        preferredLanguage: z.string(),
      }),
    }),
    async resolve({ ctx, input }) {
      try {
        // console.log(input)
        const updatedUserInfo = await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: input.form,
        })

        return updatedUserInfo
      } catch (error) {
        console.error(error)
      }
    },
  })
