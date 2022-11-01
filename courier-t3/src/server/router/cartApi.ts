import { MdOutlineWifiTetheringErrorRounded } from 'react-icons/Md'
import { z } from 'zod'
// import { createRouter } from L
import { createRouter } from './context'
import { createProtectedRouter } from './protected-routers'

async function findOrCreateCart(prisma, userId) {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      cartId: true,
    },
  })

  if (!cart) {
    const newCart = await prisma.cart.create({
      data: {
        userId: userId,
      },
      select: {
        cartId: true,
      },
    })

    return newCart
  }

  return cart
}

export const cartApi = createProtectedRouter()
  .query('getCartItems', {
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
      userId: z.string(), //logged in user
      item: z.object({
        name: z.string(),
        price: z.number(), // not needed since items are connected to the itemTable in which the order would have recieved its details
        amount: z.number(),
        productId: z.number(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { cartId } = await findOrCreateCart(ctx.prisma, input.userId)

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
  .mutation('clearUserCartSessionItems', {
    input: z.object({
      cartId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const clearedCartSession = await ctx.prisma.cartItem.deleteMany({
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
  .mutation('saveAddressesFormToCart', {
    input: z.object({
      // reciever and shipper
      userId: z.string(),
      shipper: z.object({
        userId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        shippedFrom: z.object({
          address: z.string(),
          address2: z.string(),
          address3: z.string(),
          city: z.string(),
          state: z.string(),
          postalCode: z.number(),
          country: z.string(),
          cellphone: z.string(),
          telephone: z.string(),
        }),
      }),
      reciever: z.object({
        firstName: z.string(),
        lastName: z.string(),
        shippedTo: z.object({
          address: z.string(),
          address2: z.string(),
          address3: z.string(),
          city: z.string(),
          state: z.string(),
          postalCode: z.number(),
          country: z.string(),
          cellphone: z.string(),
          telephone: z.string(),
        }),
      }),
    }),
    async resolve({ ctx, input }) {
      const { cartId } = await findOrCreateCart(ctx.prisma, input.userId)

      console.log('addeding addresses to form:', JSON.stringify(input))
      const addedShipper = await ctx.prisma.cartOrderAddresses.upsert({
        where: {
          cartId_recipient: {
            cartId: cartId,
            recipient: false,
          },
        },
        create: {
          cartId: cartId,
          recipient: false,
          ...input.shipper.shippedFrom,
        },
        update: input.shipper.shippedFrom,
      })

      const addedReciever = await ctx.prisma.cartOrderAddresses.upsert({
        where: {
          cartId_recipient: {
            cartId: cartId,
            recipient: true,
          },
        },
        create: {
          cartId: cartId,
          recipient: true,
          ...input.reciever.shippedTo,
        },
        update: input.reciever.shippedTo,
      })

      // console.log({ addedShipper, addedReciever })

      return true
    },
  })
  .query('getAddressesFromCart', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { cartId } = await findOrCreateCart(ctx.prisma, input.userId)
      const formAddresses = await ctx.prisma.cartOrderAddresses.findMany({
        where: {
          cartId: cartId,
        },
      })
      return formAddresses
    },
  })
