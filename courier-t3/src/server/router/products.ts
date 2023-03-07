import {
  createProtectedRouter,
  createProtectedStaffRouter,
} from './protected-routers'
import { z } from 'zod'

export const productsApi = createProtectedRouter().mutation('addProduct', {
  input: z.object({
    item_name: z.string(),
    item_price: z.number(),
    // item_type: z.string(),
  }),
  async resolve({ ctx, input }) {
    try {
      //$100.25 to 10025cents
      const stripePriceFormat = input.item_price * 100
      const newItem = await ctx.prisma.product.create({
        data: {
          name: input.item_name,
          price: stripePriceFormat,
        },
      })
      console.log(
        '🚀 ~ file: staffApi.ts ~ line 100 ~ resolve ~ newItem',
        newItem
      )

      return newItem
    } catch (error) {
      console.error('delete product error', error)
    }
  },
})
