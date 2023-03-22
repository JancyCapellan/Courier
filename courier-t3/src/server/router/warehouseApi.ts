import {
  createProtectedStaffRouter,
  dynamicCreateProtectedRouter,
} from './protected-routers'
import { z } from 'zod'

export const warehouseApi = createProtectedStaffRouter()
  .mutation('createWarehouse', {
    input: z.object({
      name: z.string(),
      codeName: z.string(),
      // item_name: z.string(),
      // item_price: z.number(),
      // item_type: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        // const newContainer =
        const newWarehouse = await ctx.prisma.warehouse.create({
          data: {
            name: input.name,
            codeName: input.codeName,
          },
        })

        return newWarehouse
      } catch (error) {
        console.error(error)
        return error
      }
    },
  })
  .query('getAllWarehouses', {
    async resolve({ ctx }) {
      try {
        const warehouses = await ctx.prisma.warehouse.findMany()
        return warehouses
      } catch (error) {
        console.error(error)
      }
    },
  })
  .mutation('deleteWarehouse', {
    input: z.object({
      warehouseId: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const deletedWarehouse = await ctx.prisma.warehouse.delete({
          where: {
            id: input.warehouseId,
          },
        })

        return deletedWarehouse
      } catch (error) {}
    },
  })
  // TODO:
  .mutation('createNewContainer', {
    input: z.object({
      // item_name: z.string(),
      // item_price: z.number(),
      // item_type: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        // const newContainer =
      } catch (error) {
        console.error('delete product error', error)
      }
    },
  })
