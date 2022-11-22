import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createProtectedRouter } from './protected-routers'

async function findCart(prisma, userId, customerId) {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        creatingUserId_customerId: {
          creatingUserId: userId,
          customerId: customerId,
        },
      },
      select: {
        // id: true
        cartId: true,
      },
    })

    if (!cart) return false

    return cart
  } catch (error) {
    return false
  }
}

async function findOrCreateCart(prisma, userId, customerId) {
  const cart = await prisma.cart.findUnique({
    where: {
      creatingUserId_customerId: {
        creatingUserId: userId,
        customerId: customerId,
      },
    },
    select: {
      id: true,
      cartId: true,
    },
  })

  if (!cart) {
    const newCart = await prisma.cart.create({
      data: {
        customerId: customerId,
        creatingUserId: userId,
      },
      select: {
        id: true,
        cartId: true,
      },
    })

    return newCart
  }

  return cart
}

export const cartApi = createProtectedRouter()
  .query('getCartSession', {
    input: z.object({
      userId: z.string(),
      customerId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const cartSession = await ctx.prisma.cart.findUnique({
        where: {
          creatingUserId_customerId: {
            creatingUserId: input.userId,
            customerId: input.customerId,
          },
        },
        select: {
          cartId: true,
          customerId: true,
          creatingUserId: true,
          items: {
            select: {
              quantity: true,
              product: {
                select: {
                  name: true,
                  stripePriceId: true,
                  stripeProductId: true,
                  price: true,
                },
              },
            },
          },
          addresses: {
            select: {
              firstName: true,
              lastName: true,
              address: true,
              address2: true,
              address3: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
              cellphone: true,
              telephone: true,
              recipient: true,
            },
          },
        },
      })
      console.log(
        '🚀 ~ file: cartApi.ts ~ line 110 ~ resolve ~ cartSession',
        cartSession
      )
      return cartSession
    },
  })
  .query('getCartItems', {
    input: z.object({
      userId: z.string(),
      customerId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const cartSession = await ctx.prisma.cart.findUnique({
          where: {
            creatingUserId_customerId: {
              creatingUserId: input.userId,
              customerId: input.customerId,
            },
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
                    stripePriceId: true,
                    // stripeProductId: true,
                    // productType: true,
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
      customerId: z.string(),
      item: z.object({
        name: z.string(),
        price: z.number(), // not needed since items are connected to the itemTable in which the order would have recieved its details
        amount: z.number(),
        productId: z.number(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { cartId } = await findOrCreateCart(
        ctx.prisma,
        input.userId,
        input.customerId
      )

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
      customerId: z.string(),
      shipper: z.object({
        // userId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
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
      reciever: z.object({
        firstName: z.string(),
        lastName: z.string(),
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
    async resolve({ ctx, input }) {
      const { cartId } = await findOrCreateCart(
        ctx.prisma,
        input.userId,
        input.customerId
      )

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
          ...input.shipper,
        },
        update: input.shipper,
      })
      console.log(
        '🚀 ~ file: cartApi.ts ~ line 245 ~ resolve ~ addedShipper',
        addedShipper
      )

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
          ...input.reciever,
        },
        update: input.reciever,
      })
      console.log(
        '🚀 ~ file: cartApi.ts ~ line 260 ~ resolve ~ addedReciever',
        addedReciever
      )

      // console.log({ addedShipper, addedReciever })

      return [addedShipper, addedReciever]
    },
  })
  .query('getAddressesFromCart', {
    input: z.object({
      userId: z.string(),
      customerId: z.string(),
    }),
    async resolve({ ctx, input }) {
      // want to only find the cart id not create if no cart is found until needed to
      const cart = await findCart(ctx.prisma, input.userId, input.customerId)

      if (cart === false) {
        return null
      }

      const formAddresses = await ctx.prisma.cartOrderAddresses.findMany({
        where: {
          cartId: cart.cartId,
        },
        select: {
          firstName: true,
          lastName: true,
          address: true,
          address2: true,
          address3: true,
          city: true,
          state: true,
          postalCode: true,
          country: true,
          cellphone: true,
          telephone: true,
          recipient: true,
        },
      })
      console.log(
        '🚀 ~ file: cartApi.ts ~ line 274 ~ resolve ~ formAddresses',
        formAddresses
      )

      if (formAddresses === undefined || formAddresses.length == 0) {
        // array does not exist or is empty
        return null
      }
      return formAddresses
    },
  })
  .mutation('clearCart', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const clearedCart = await ctx.prisma.cart.delete({
          where: {
            userId: input.userId,
          },
        })
        console.log(
          '🚀 ~ file: cartApi.ts ~ line 309 ~ resolve ~ clearedCart',
          clearedCart
        )
        return clearedCart
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find a cart to delete',
          cause: error,
        })
      }
    },
  })
  .mutation('createOrderAfterCheckout', {
    input: z.object({
      customerId: z.string(),
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      // find cart made by user for customer, add info to order table, remove cart entry
      //TODO: after checkout is competed stripe returns to app this endpoint is called to make sure the checkout was completed and successly added to the app database, the  webhook for checkout session completed will also attempt to add the checkout to the order. the stripe checkout information is not avaible here, outside porblem from the webhook that does have the stripe object. how do i get that information into the order after the checkout is completed? i have access to the stripecheckoutID from the moment the checkout was created after pay online was choosen, maybe cache or create the order at that moment, the order will be a temp order from the cart details and create checkout session details, the stripe checkout details will be updated by the webhook after the fact but to start off having all the cart session infromation and a way to query stripe checkout is better than no information.
      const cartSession = await ctx.prisma.cart.findUnique({
        where: {
          creatingUserId_customerId: {
            creatingUserId: input.userId,
            customerId: input.customerId,
          },
        },
        select: {
          cartId: true,
          customerId: true,
          creatingUserId: true,
          items: {
            select: {
              quantity: true,
              product: {
                select: {
                  name: true,
                  stripePriceId: true,
                  stripeProductId: true,
                  price: true,
                },
              },
            },
          },
          addresses: {
            select: {
              firstName: true,
              lastName: true,
              address: true,
              address2: true,
              address3: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
              cellphone: true,
              telephone: true,
              recipient: true,
            },
          },
        },
      })
      console.log(
        '🚀 ~ file: cartApi.ts ~ line 468 ~ resolve ~ cartSession',
        cartSession
      )
      // const { cartId } = await findCart(
      //   ctx.prisma,
      //   input.userId,
      //   input.customerId
      // )

      // const cartDetails = await ctx.prisma.cart.findUnique({
      //   where: {
      //     cartId: cartId,
      //   },
      //   include: {
      //     items: true,
      //     addresses: true,
      //   },
      // })
      // console.log(
      //   '🚀 ~ file: cartApi.ts ~ line 437 ~ resolve ~ cartDetails',
      //   cartDetails
      // )

      // const createdOrder = await ctx.prisma.order.create({
      //   data: {
      //     // userid customer id
      //     //
      //   },
      // })
    },
  })
  .mutation('createPendingOrderBeforeCheckoutCompletes', {
    input: z.object({
      userId: z.string(),
      customerId: z.string(),
      stripeCheckoutId: z.string(),
    }),
    async resolve({ ctx, input }) {
      let pendingOrder
      try {
        const cartSession = await ctx.prisma.cart.findUnique({
          where: {
            creatingUserId_customerId: {
              creatingUserId: input.userId,
              customerId: input.customerId,
            },
          },
          select: {
            cartId: true,
            customerId: true,
            creatingUserId: true,
            items: {
              select: {
                quantity: true,
                productId: true,
              },
            },
            addresses: {
              select: {
                firstName: true,
                lastName: true,
                address: true,
                address2: true,
                address3: true,
                city: true,
                state: true,
                postalCode: true,
                country: true,
                cellphone: true,
                telephone: true,
                recipient: true,
              },
            },
          },
        })
        console.log(
          '🚀 ~ file: cartApi.ts ~ line 542 ~ resolve ~ cartSession',
          cartSession
        )
        pendingOrder = await ctx.prisma.order.create({
          data: {
            customer: {
              connect: {
                id: input.customerId,
              },
            },
            creatorUser: {
              connect: {
                id: input.userId,
              },
            },
            paymentType: 'STRIPE',
            status: {
              connectOrCreate: {
                where: {
                  message: 'PENDING PAYMENT',
                },
                create: {
                  message: 'PENDING PAYMENT',
                },
              },
            },
            items: {
              createMany: {
                //@ts-ignore
                data: cartSession?.items,
              },
            },
            addresses: {
              createMany: {
                //@ts-ignore
                data: cartSession?.addresses,
              },
            },
            stripeCheckoutId: input.stripeCheckoutId,
          },
          include: {
            items: true,
          },
        })
        console.log(
          '🚀 ~ file: cartApi.ts ~ line 585 ~ resolve ~ pendingOrder',
          pendingOrder
        )
      } catch (error) {
        console.log('🚀 ~ file: cartApi.ts ~ line 548 ~ resolve ~ error', error)
        return pendingOrder
      }

      const deleteCartSession = await ctx.prisma.cart.delete({
        where: {
          creatingUserId_customerId: {
            creatingUserId: input.userId,
            customerId: input.customerId,
          },
        },
      })
      console.log(
        '🚀 ~ file: cartApi.ts ~ line 596 ~ resolve ~ deleteCartSession',
        deleteCartSession
      )
      return pendingOrder
    },
  })
