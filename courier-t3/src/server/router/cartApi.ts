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
      try {
        const cartSession = await ctx.prisma.cart.findUnique({
          where: {
            userId: input.userId,
          },
          select: {
            items: {
              select: {
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
              orderBy: {
                id: 'asc',
              },
            },
            cartId: true,
          },
        })
        console.log('cartSession:', cartSession)
        return cartSession
      } catch (error) {
        console.error('error findign cart', error)
      }
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
        const cart = await ctx.prisma.cart.findUnique({
          where: {
            userId: input.userId,
          },
          select: {
            // id: true,
            cartId: true,
          },
        })

        if (!cart) {
          const newCart = await ctx.prisma.cart.create({
            data: {
              userId: input.userId,
            },
            select: {
              cartId: true,
            },
          })

          return newCart
        }

        return cart
      }

      const { cartId } = await findOrCreateCart()

      const prevItemQuantity = await ctx.prisma.cartItem.findUnique({
        where: {
          CartItemId: {
            productId: input.item.productId,
            cartId: cartId,
          },
        },
        select: {
          quantity: true,
        },
      })

      const prevQty = prevItemQuantity?.quantity ?? 0

      const addedItem = await ctx.prisma.cartItem.upsert({
        where: {
          CartItemId: {
            productId: input.item.productId,
            cartId: cartId,
          },
        },
        create: {
          productId: input.item.productId,
          quantity: input.item.amount,
          cartId: cartId,
        },
        update: {
          quantity: input.item.amount + prevQty,
        },
      })
      console.log('item added to cart:', addedItem)
      return addedItem
    },
  })
  .mutation('clearUserCartSession', {
    input: z.object({
      cartId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const clearedCartSession = await ctx.prisma.cart.delete({
        where: {
          cartId: input.cartId,
        },
      })
      return clearedCartSession
    },
  })
  .mutation('removeItemFromCart', {
    input: z.object({
      productId: z.number(),
      cartId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const removedItem = await ctx.prisma.cartItem.delete({
        where: {
          CartItemId: {
            productId: input.productId,
            cartId: input.cartId,
          },
        },
      })
      return removedItem
    },
  })
  .mutation('toggleCartItemAmount', {
    input: z.object({
      productId: z.number(),
      cartId: z.string(),
      toggleType: z.string(),
      currentQuantity: z.number(),
    }),
    async resolve({ ctx, input }) {
      let quantityChange = input.toggleType === 'inc' ? 1 : -1
      console.log(quantityChange)
      const removedItem = await ctx.prisma.cartItem.update({
        where: {
          CartItemId: {
            productId: input.productId,
            cartId: input.cartId,
          },
        },
        data: {
          quantity: input.currentQuantity + quantityChange,
        },
      })
      return removedItem
    },
  })
