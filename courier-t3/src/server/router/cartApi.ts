import { z } from 'zod'
// import { createRouter } from L
import { createRouter } from './context'
import { createProtectedRouter } from './protected-routers'

export const cartApi = createProtectedRouter()
  .query('getCartSession', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const cartSession = await ctx.prisma.shoppingSession.findUnique({
        where: {
          userId: input.userId,
        },
        select: {
          items: {
            select: {
              sessionId: true,
              quantity: true,
              productId: true,
              product: {
                select: {
                  name: true,
                  price: true,
                  productType: true,
                },
              },
            },
          },
          id: true,
          // userId: true,
        },
      })
      return cartSession
    },
  })
  .mutation('addToCartSession', {
    input: z.object({
      userId: z.string(),
      item: z.object({
        name: z.string(),
        price: z.number(), // not needed since items are connected to the itemTable in which the order would have recieved its details
        amount: z.number(),
        productId: z.number(),
      }),
    }),
    async resolve({ ctx, input }) {
      async function findOrCreateCart() {
        const cartSession = await ctx.prisma.shoppingSession.findUnique({
          where: {
            userId: input.userId,
          },
          select: {
            id: true,
          },
        })

        if (!cartSession) {
          const newCart = await ctx.prisma.shoppingSession.create({
            data: {
              userId: input.userId,
            },
            select: {
              id: true,
            },
          })

          return newCart
        }

        return cartSession
      }

      const cartId = await findOrCreateCart()

      const prevItemQuantity = await ctx.prisma.shoppingSessionItem.findUnique({
        where: {
          CartItemId: {
            productId: input.item.productId,
            sessionId: cartId.id,
          },
        },
        select: {
          quantity: true,
        },
      })

      const prevQty = prevItemQuantity?.quantity ?? 0

      const addedItem = await ctx.prisma.shoppingSessionItem.upsert({
        where: {
          CartItemId: {
            productId: input.item.productId,
            sessionId: cartId.id,
          },
        },
        create: {
          productId: input.item.productId,
          quantity: input.item.amount,
          sessionId: cartId.id,
        },
        update: {
          quantity: input.item.amount + prevQty,
        },
      })
      return addedItem
    },
  })
  .mutation('clearUserCartSession', {
    input: z.object({
      sessionId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const clearedCartSession = await ctx.prisma.shoppingSession.delete({
        where: {
          id: input.sessionId,
        },
      })
      return clearedCartSession
    },
  })
  .mutation('removeItemFromCart', {
    input: z.object({
      productId: z.number(),
      sessionId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const removedItem = await ctx.prisma.shoppingSessionItem.delete({
        where: {
          CartItemId: {
            productId: input.productId,
            sessionId: input.sessionId,
          },
        },
      })
    },
  })
