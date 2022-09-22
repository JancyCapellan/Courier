import { createRouter } from './context'
import {
  createProtectedStaffRouter,
  createProtectedRouter,
} from './protected-routers'
import { z } from 'zod'

export const staffApi = createProtectedRouter()
  .mutation('deleteProductType', {
    input: z.object({
      typeId: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const deletedProductType = await prisma?.productType.delete({
          where: {
            id: input.typeId,
          },
        })
        return deletedProductType
      } catch (error) {
        console.error('delete product error', error)
      }
    },
  })
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
  .mutation('addProduct', {
    input: z.object({
      item_name: z.string(),
      item_price: z.number(),
      item_type: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const newItem = await ctx.prisma.product.create({
          data: {
            name: input.item_name,
            price: input.item_price,
            type: input.item_type,
          },
        })

        return newItem
      } catch (error) {
        console.error('delete product error', error)
      }
    },
  })
  .mutation('addProductType', {
    input: z.object({
      type: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const newProductType = await ctx.prisma.productType.create({
          data: {
            type: input.type,
          },
        })

        return newProductType
      } catch (error) {
        console.error('delete product error', error)
      }
    },
  })
