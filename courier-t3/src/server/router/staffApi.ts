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
  // .mutation('addProduct', {
  //   input: z.object({
  //     item_name: z.string(),
  //     item_price: z.number(),
  //     // item_type: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  //       apiVersion: '2022-08-01',
  //     })
  //     let createdStripeProduct
  //     try {
  //       createdStripeProduct = await stripe.products.create({
  //         name: input.item_name,
  //         default_price_data: {
  //           unit_amount: input.item_price,
  //           currency: 'usd',
  //         },
  //       })
  //       console.log(
  //         '🚀 ~ file: staffApi.ts ~ line 81 ~ resolve ~ createdStripeProduct',
  //         createdStripeProduct
  //       )
  //     } catch (error) {
  //       throw error
  //       // i could return or still add to database and add a column for i striped?
  //     }

  //     try {
  //       const newItem = await ctx.prisma.product.create({
  //         data: {
  //           name: input.item_name,
  //           price: input.item_price,
  //           // type: input.item_type,
  //           stripePriceId: createdStripeProduct.default_price?.toString(),
  //           stripeProductId: createdStripeProduct.id,
  //         },
  //       })
  //       console.log(
  //         '🚀 ~ file: staffApi.ts ~ line 100 ~ resolve ~ newItem',
  //         newItem
  //       )

  //       return newItem
  //     } catch (error) {
  //       console.error('delete product error', error)
  //     }
  //   },
  // })
  // .mutation('addProductType', {
  //   input: z.object({
  //     type: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     try {
  //       const newProductType = await ctx.prisma.productType.create({
  //         data: {
  //           type: input.type,
  //         },
  //       })

  //       return newProductType
  //     } catch (error) {
  //       console.error('delete product error', error)
  //     }
  //   },
  // })
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
