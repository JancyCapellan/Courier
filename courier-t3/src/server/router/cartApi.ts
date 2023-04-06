import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createProtectedRouter } from './protected-routers'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

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
        cartId: true,
      },
    })

    return newCart
  }

  return cart
}

async function getCartTotalCost(prisma, cartId) {
  try {
    const total = await prisma.cart.findFirst({
      where: {
        cartId: cartId,
      },
      select: {
        totalCost: true,
      },
    })
    if (!total.totalCost) return 0

    return total.totalCost
  } catch (error) {
    console.log({ error })
  }
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
                  price: true,
                },
              },
            },
          },
          shipperAddress: {
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
            },
          },
          recieverAddress: {
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
            },
          },
        },
      })
      // console.log(
      //   '🚀 ~ file: cartApi.ts ~ line 110 ~ resolve ~ cartSession',
      //   cartSession
      // )
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
            totalCost: true,
            items: {
              select: {
                quantity: true,
                productId: true,
                product: {
                  select: {
                    name: true,
                    price: true,
                    // stripePriceId: true,
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
        // console.log('cartSession:', cartSession)

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
        amount: z.number(),
        productId: z.bigint(),
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
        include: {
          product: {
            select: {
              price: true,
            },
          },
        },
      })

      let totalCost = await getCartTotalCost(ctx.prisma, cartId)
      console.log(
        'item added to cart:',
        addedItem,
        totalCost,
        addedItem.product.price,
        addedItem.quantity
      )
      const updatedCartTotal = await ctx.prisma.cart.update({
        where: {
          cartId: cartId,
        },
        data: {
          totalCost: totalCost + addedItem.product.price * input.item.amount,
        },
      })
      return addedItem
    },
  })
  .mutation('clearUserCartSessionItems', {
    input: z.object({
      cartId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const clearedCartSession = await ctx.prisma.cartItem.deleteMany({
          where: {
            cartId: input.cartId,
          },
        })

        const clearedTotalCost = await ctx.prisma.cart.update({
          where: {
            cartId: input.cartId,
          },
          data: {
            totalCost: 0,
          },
        })
        return true
      } catch (error) {
        throw error
      }
    },
  })
  .mutation('removeItemFromCart', {
    input: z.object({
      productId: z.bigint(),
      cartId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const removedItem = await ctx.prisma.cartItem.delete({
          where: {
            CartItemId: {
              productId: input.productId,
              cartId: input.cartId,
            },
          },
          select: {
            quantity: true,
            product: {
              select: {
                price: true,
              },
            },
          },
        })

        let totalCost = await getCartTotalCost(ctx.prisma, input.cartId)
        const totalCostAfterRemove = await ctx.prisma.cart.update({
          where: {
            cartId: input.cartId,
          },
          data: {
            totalCost:
              totalCost - removedItem.product.price * removedItem.quantity,
          },
          select: {
            totalCost: true,
          },
        })

        return totalCostAfterRemove.totalCost
      } catch (error) {
        throw error
      }
    },
  })
  .mutation('toggleCartItemAmount', {
    input: z.object({
      productId: z.bigint(),
      cartId: z.string(),
      toggleType: z.string(),
      currentQuantity: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
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
          select: {
            product: {
              select: {
                price: true,
              },
            },
          },
        })

        let totalCost = await getCartTotalCost(ctx.prisma, input.cartId)

        const totalCostAfterToggle = await ctx.prisma.cart.update({
          where: {
            cartId: input.cartId,
          },
          data: {
            totalCost: totalCost + removedItem.product.price * quantityChange,
          },
          select: {
            totalCost: true,
          },
        })
      } catch (error) {
        throw error
      }

      return true
    },
  })
  .mutation('saveShipperPickupAddressToCart', {
    input: z.object({
      // reciever and shipper
      userId: z.string(),
      customerId: z.string(),
      shipper: z.object({
        // userId: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        address: z.string(),
        address2: z.string().optional(),
        address3: z.string().optional(),
        city: z.string(),
        state: z.string(),
        postalCode: z.number(),
        country: z.string(),
        cellphone: z.string(),
        telephone: z.string().optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { cartId } = await findOrCreateCart(
        ctx.prisma,
        input.userId,
        input.customerId
      )

      // console.log('addeding addresses to form:', JSON.stringify(input))
      const addedShipper = await ctx.prisma.cartShipperAddress.upsert({
        where: {
          cartId: cartId,
        },
        create: {
          cartId: cartId,
          ...input.shipper,
        },
        update: input.shipper,
      })
      console.log('Saved Shipper Address:', addedShipper)
    },
  })
  //TODO
  .mutation('saveRecieverDeliveryAddressToCart', {
    input: z.object({
      // reciever and shipper
      userId: z.string(),
      customerId: z.string(),
      reciever: z.object({
        firstName: z.string(),
        lastName: z.string(),
        address: z.string(),
        address2: z.string().optional(),
        address3: z.string().optional(),
        city: z.string(),
        state: z.string(),
        postalCode: z.number(),
        country: z.string(),
        cellphone: z.string(),
        telephone: z.string().optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { cartId } = await findOrCreateCart(
        ctx.prisma,
        input.userId,
        input.customerId
      )

      // console.log('addeding addresses to form:', JSON.stringify(input))
      const addedShipper = await ctx.prisma.cartRecieverAddress.upsert({
        where: {
          cartId: cartId,
        },
        create: {
          cartId: cartId,
          ...input.reciever,
        },
        update: input.reciever,
      })
      console.log('Saved Shipper Address:', addedShipper)
    },
  })
  // .mutation('saveAddressesFormToCart', {
  //   input: z.object({
  //     // reciever and shipper
  //     userId: z.string(),
  //     customerId: z.string(),
  //     shipper: z.object({
  //       // userId: z.string(),
  //       firstName: z.string(),
  //       lastName: z.string(),
  //       address: z.string(),
  //       address2: z.string(),
  //       address3: z.string(),
  //       city: z.string(),
  //       state: z.string(),
  //       postalCode: z.number(),
  //       country: z.string(),
  //       cellphone: z.string(),
  //       telephone: z.string(),
  //     }),
  //     reciever: z.object({
  //       firstName: z.string(),
  //       lastName: z.string(),
  //       address: z.string(),
  //       address2: z.string(),
  //       address3: z.string(),
  //       city: z.string(),
  //       state: z.string(),
  //       postalCode: z.number(),
  //       country: z.string(),
  //       cellphone: z.string(),
  //       telephone: z.string(),
  //     }),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const { cartId } = await findOrCreateCart(
  //       ctx.prisma,
  //       input.userId,
  //       input.customerId
  //     )

  //     // console.log('addeding addresses to form:', JSON.stringify(input))
  //     const addedShipper = await ctx.prisma.cartOrderAddresses.upsert({
  //       where: {
  //         cartId_recipient: {
  //           cartId: cartId,
  //           recipient: false,
  //         },
  //       },
  //       create: {
  //         cartId: cartId,
  //         recipient: false,
  //         ...input.shipper,
  //       },
  //       update: input.shipper,
  //     })
  //     console.log('Saved Shipper Address:', addedShipper)

  //     const addedReciever = await ctx.prisma.cartOrderAddresses.upsert({
  //       where: {
  //         cartId_recipient: {
  //           cartId: cartId,
  //           recipient: true,
  //         },
  //       },
  //       create: {
  //         cartId: cartId,
  //         recipient: true,
  //         ...input.reciever,
  //       },
  //       update: input.reciever,
  //     })
  //     console.log('Saved Reciever address:', addedReciever)

  //     // console.log({ addedShipper, addedReciever })

  //     return [addedShipper, addedReciever]
  //   },
  // })
  // .query('getAddressesFromCart', {
  //   input: z.object({
  //     userId: z.string(),
  //     customerId: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     // want to only find the cart id not create if no cart is found until needed to
  //     const cart = await findCart(ctx.prisma, input.userId, input.customerId)

  //     if (cart === false) {
  //       return null
  //     }

  //     const formAddresses = await ctx.prisma.cartOrderAddresses.findMany({
  //       where: {
  //         cartId: cart.cartId,
  //       },
  //       select: {
  //         firstName: true,
  //         lastName: true,
  //         address: true,
  //         address2: true,
  //         address3: true,
  //         city: true,
  //         state: true,
  //         postalCode: true,
  //         country: true,
  //         cellphone: true,
  //         telephone: true,
  //         recipient: true,
  //       },
  //     })
  //     // console.log(
  //     //   '🚀 ~ file: cartApi.ts ~ line 274 ~ resolve ~ formAddresses',
  //     //   formAddresses
  //     // )

  //     if (formAddresses === undefined || formAddresses.length == 0) {
  //       // array does not exist or is empty
  //       return null
  //     }
  //     return formAddresses
  //   },
  // })
  .query('getShipperAddressFromCart', {
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

      const shipperAddress = await ctx.prisma.cartShipperAddress.findUnique({
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
        },
      })
      // console.log(
      //   '🚀 ~ file: cartApi.ts ~ line 274 ~ resolve ~ formAddresses',
      //   formAddresses
      // )

      // if (shipperAddress === undefined || shipperAddress.length == 0) {
      //   // array does not exist or is empty
      //   return null
      // }
      return shipperAddress
    },
  })
  .query('getRecieverAddressFromCart', {
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

      const recieverAddress = await ctx.prisma.cartRecieverAddress.findUnique({
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
        },
      })
      // console.log(
      //   '🚀 ~ file: cartApi.ts ~ line 274 ~ resolve ~ formAddresses',
      //   formAddresses
      // )

      // if (formAddresses === undefined || formAddresses.length == 0) {
      //   // array does not exist or is empty
      //   return null
      // }
      return recieverAddress
    },
  })
  .mutation('clearCart', {
    input: z.object({
      userId: z.string(),
      customerId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const deleteCartSession = await ctx.prisma.cart.delete({
          where: {
            creatingUserId_customerId: {
              creatingUserId: input.userId,
              customerId: input.customerId,
            },
          },
        })
        console.log('deleteCartSession', deleteCartSession)
        return deleteCartSession
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message:
            'Could not find a cart to delete, order was successful so cart may have been previously deleted',
          cause: error,
        })
      }
    },
  })
  .mutation('clearCartById', {
    input: z.object({
      cartId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const deleteCartSession = await ctx.prisma.cart.delete({
          where: {
            cartId: input.cartId,
          },
        })
        return deleteCartSession
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
                  // stripePriceId: true,
                  // stripeProductId: true,
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

  //createPendingOrder
  .mutation('createPendingOrderBeforeCheckoutCompletes', {
    input: z.object({
      userId: z.string(),
      customerId: z.string(),
      stripeCheckoutId: z.string().optional(),
      // paymentType: z.enum(['CARD', 'CASH', 'CHECK', 'QUICKPAY', 'STRIPE']),
      stripeCheckoutUrl: z.string().optional(),
      pickupDate: z.string(),
      pickupTime: z.string(),
      // stripePaymentIntent: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      // console.log('🚀 ~ file: cartApi.ts:510 ~ resolve ~ input:', input)
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
            totalCost: true,
            items: {
              select: {
                quantity: true,
                productId: true,
              },
            },
            shipperAddress: {
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
              },
            },
            recieverAddress: {
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
              },
            },
          },
        })
        // console.log(
        //   '🚀 ~ file: cartApi.ts ~ line 551 ~ resolve ~ cartSession',
        //   cartSession
        // )
        // console.log({ timePlaced })

        let timePlaced = dayjs()
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
            // paymentType: input.paymentType,
            paymentStatuses: {
              connectOrCreate: {
                where: {
                  status: 'PENDING PAYMENT',
                },
                create: {
                  status: 'PENDING PAYMENT',
                },
              },
            },
            totalCost: cartSession?.totalCost,
            status: {
              connectOrCreate: {
                where: {
                  message: 'awaiting pickup',
                },
                create: {
                  message: 'awaiting pickup',
                },
              },
            },
            items: {
              createMany: {
                //@ts-ignore
                data: cartSession?.items,
              },
            },
            shipperAddress: {
              create: {
                firstName: cartSession?.shipperAddress?.firstName,
                lastName: cartSession?.shipperAddress?.lastName,
                address: cartSession?.shipperAddress?.address,
                address2: cartSession?.shipperAddress?.address2,
                address3: cartSession?.shipperAddress?.address3,
                city: cartSession?.shipperAddress?.city,
                state: cartSession?.shipperAddress?.state,
                postalCode: cartSession?.shipperAddress?.postalCode,
                country: cartSession?.shipperAddress?.country,
                cellphone: cartSession?.shipperAddress?.cellphone,
                telephone: cartSession?.shipperAddress?.telephone,
              },
            },
            recieverAddress: {
              create: {
                firstName: cartSession?.recieverAddress?.firstName,
                lastName: cartSession?.recieverAddress?.lastName,
                address: cartSession?.recieverAddress?.address,
                address2: cartSession?.recieverAddress?.address2,
                address3: cartSession?.recieverAddress?.address3,
                city: cartSession?.recieverAddress?.city,
                state: cartSession?.recieverAddress?.state,
                postalCode: cartSession?.recieverAddress?.postalCode,
                country: cartSession?.recieverAddress?.country,
                cellphone: cartSession?.recieverAddress?.cellphone,
                telephone: cartSession?.recieverAddress?.telephone,
              },
            },
            // timePlaced: timePlaced,
            pickupDate: input.pickupDate,
            pickupTime: input.pickupTime,
            // stripeCheckoutId:
            //   // made this way becuase not all orders go through stripe so some may need an empty column, i dont remember why null doesnt work because i could avoid this if input.stripeCheckoutId is null from not exising already from creating the checkout order
            //   input.stripeCheckoutId !== null // this was the problem stopping the webhook from updating pending order
            //     ? input.stripeCheckoutId
            //     : undefined,
            // stripeCheckoutUrl: input.stripeCheckoutUrl,
            // stripePaymentIntent: input?.stripePaymentIntent,
          },
          include: {
            items: true,
          },
        })
        // console.log('cartApi.ts 595 ~ pendingOrder', pendingOrder)

        // TODO: update customer balance

        const getCustomerBalance = await ctx.prisma.user.findUniqueOrThrow({
          where: {
            id: input.customerId,
          },
          select: {
            currentBalance: true,
          },
        })

        const updatedCustomerBalance = await ctx.prisma.user.update({
          where: {
            id: input.customerId,
          },
          data: {
            currentBalance:
              getCustomerBalance?.currentBalance! + cartSession?.totalCost!,
          },
        })

        return pendingOrder
      } catch (error) {
        console.error(
          '🚀 ~ file: cartApi.ts ~ line 601 ~ resolve ~ error',
          error
        )
      }
    },
  })
