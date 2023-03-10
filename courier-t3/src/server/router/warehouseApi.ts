import { dynamicCreateProtectedRouter } from './protected-routers'
import { z } from 'zod'

export const warehouseApi = dynamicCreateProtectedRouter('STAFF')
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
      }
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
