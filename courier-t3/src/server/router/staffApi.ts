import { createRouter } from './context'
import {
  createProtectedStaffRouter,
  createProtectedRouter,
} from './protected-routers'
import { z } from 'zod'
import Stripe from 'stripe'

export const staffApi = createProtectedRouter()
  // .mutation('deleteProductType', {
  //   input: z.object({
  //     typeId: z.number(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     try {
  //       const deletedProductType = await ctx.prisma.productType.delete({
  //         where: {
  //           id: input.typeId,
  //         },
  //       })
  //       return deletedProductType
  //     } catch (error) {
  //       console.error('delete product error', error)
  //       throw error
  //     }
  //   },
  // })
  .query('getAllStaff', {
    input: z.object({
      queryPageIndex: z.number(),
      queryPageSize: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const drivers = await ctx.prisma.user.findMany({
          skip: input.queryPageIndex,
          take: input.queryPageSize,
          where: {
            OR: [{ role: 'DRIVER' }],
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            branchName: true,
            role: true,
          },
        })

        const driversTableCount = await ctx.prisma.user.count({
          where: {
            role: 'DRIVER',
          },
        })
        return { drivers: drivers, driversTotalCount: driversTableCount }
      } catch (error) {
        console.error('delete product error', error)
      }
    },
  })
  .query('getUniqueStaff', {
    input: z.object({
      staffId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const staffInfo = await ctx.prisma.user.findUnique({
          where: {
            id: input.staffId,
          },
          include: {
            pickups: {
              select: {
                id: true,
                customer: true,
                addresses: {
                  select: {
                    address: true,
                    address2: true,
                    address3: true,
                  },
                },
              },
            },
          },
        })

        return staffInfo
      } catch (error) {
        console.log('error getting staff information', error)
      }
    },
  })
