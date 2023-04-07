// import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { createProtectedRouter } from './protected-routers'
import dayjs from 'dayjs'

export const invoiceApi = createProtectedRouter()
  .query('getPickupDriversAndZones', {
    // input: z.object({}),
    async resolve({ ctx, input }) {
      // TODO: filter by warehouse location
      const pickupZones = await ctx.prisma.pickupZone.findMany()
      const pickupDrivers = await ctx.prisma.user.findMany({
        where: {
          role: 'DRIVER',
        },
      })

      const data = { pickupZones: pickupZones, drivers: pickupDrivers }

      return data
    },
  })
  .query('getAllOrders', {
    input: z.object({
      queryPageIndex: z.number(),
      queryPageSize: z.number(),
    }),
    async resolve({ ctx, input }) {
      const offset = input.queryPageIndex * input.queryPageSize

      const orders = await ctx.prisma.order
        .findMany({
          skip: offset,
          take: input.queryPageSize,
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            pickupDriver: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            status: {
              select: {
                message: true,
              },
            },
            pickupZone: {
              select: {
                name: true,
              },
            },
          },
        })
        .catch(async (e) => {
          // res.status(500).send({ error: 'Something failed!' })
          throw e
        })
      // console.log(
      //   '🚀 ~ file: invoiceApi.ts ~ line 62 ~ resolve ~ orders',
      //   orders
      // )

      const orderCount = await ctx.prisma.order.count()
      if (orders) {
        // changing timePlaced for orders into readable local values
        // time is in 2021-11-01T16:23:29.139Z format, UTC
        //might make it so i can get both date and time seperatly in response
        for (const obj in orders)
          for (const key in orders[obj])
            if (key === 'timePlaced') {
              // console.log('datetime', result[obj][key])

              // console.log(result[obj][key].toLocaleString())
              // console.log(result[obj][key].toTimeString())
              // console.log(result[obj][key].toDateString())
              // result[obj][key] = {
              //   date: result[obj][key].toDateString(),
              //   time: result[obj][key].toTimeString(),
              // }

              //  orders[obj][key] = orders[obj][key].toLocaleString('en-US')
              orders[obj][key] = dayjs(orders[obj][key]).format(
                'dddd, MMMM D, YYYY h:mm A'
              )
            }

        let data = { orders: orders, orderCount: orderCount }
        return data
      }
    },
  })

  // .query('getAllDriverOrders', {
  //   input: z.object({
  //     driverId: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     try {
  //       const allDriverOrders = await ctx.prisma.order.findMany({
  //         where: {
  //           pickupDriverId: input.driverId,
  //         },
  //         // TODO: select order information needed to view orders
  //       })

  //       console.log({ allDriverOrders })
  //       return allDriverOrders
  //     } catch (error) {
  //       throw error
  //     }
  //   },
  // })

  .mutation('changeOrderPickupDriver', {
    input: z.object({
      orderId: z.number(),
      newPickUpDriverId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const orderId = input.orderId
      const driverId = input.newPickUpDriverId
      // console.log('updateorderpickupdriver by id:', id, driverId)

      console.log({ driverId })
      if (driverId === 'none') {
        const removedPickupDriver = await ctx.prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            pickupDriver: {
              disconnect: true,
            },
          },
        })

        return removedPickupDriver
      }

      const changedPickupDriver = await ctx.prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          pickupDriver: {
            connect: {
              id: driverId,
            },
          },
        },
        select: {
          id: true,
          pickupDriver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      })
      // console.log(
      //   '🚀 ~ file: invoiceApi.ts ~ line 115 ~ resolve ~ chagedPickupDriver',
      //   changedPickupDriver
      // )

      return changedPickupDriver
    },
  })
  .mutation('changeManyOrdersPickupDriver', {
    input: z.object({
      orderIds: z.number().array(),
      newPickUpDriverId: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log('OrderIds:', input.orderIds)

      if (input.newPickUpDriverId === 'none') {
        const removedPickupDriver = await ctx.prisma.order.updateMany({
          where: {
            id: {
              in: input.orderIds,
            },
          },
          data: {
            pickupDriverId: null,
          },
        })

        return removedPickupDriver
      }

      // note: returns the numbner of orders changed
      const changedManyOrdersPickupDriver = await ctx.prisma.order.updateMany({
        where: {
          id: {
            in: input.orderIds,
          },
        },
        data: {
          pickupDriverId: input.newPickUpDriverId,
        },
      })
      return {
        orderIds: input.orderIds,
      }
    },
  })
  .query('getOrderById', {
    input: z.object({
      orderId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const order = await ctx.prisma.order.findUnique({
        where: {
          orderId: input.orderId,
        },
        select: {
          id: true,
          customer: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
            },
          },
          pickupDriver: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
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
          items: {
            select: {
              // quantity: true,
              id: true,
              productId: true,
              product: {
                select: {
                  price: true,
                  name: true,
                  // stripeProductId: true,
                },
              },
            },
          },
          status: {
            select: {
              message: true,
            },
          },
          // currentBalance: true,
          orderId: true,
          totalBalancePaid: true,
          totalCost: true,
          timePlaced: true,
          pickupDate: true,
          pickupTime: true,
          paymentStatus: true,
          // stripeCheckoutId: true,
          // stripeCheckoutUrl: true,
          // stripeReceiptUrl: true,
          // stripePaymentIntent: true,
        },
      })

      // console.log({ order })

      if (order) {
        // changing timePlaced for orders into readable local values
        for (const key in order)
          if (key === 'timePlaced') {
            order[key] = order[key].toLocaleString()
          }

        const filteredDuplicates = order.items.filter(
          (obj, index) =>
            order.items.findIndex(
              (item) => item.product.name === obj.product.name
            ) === index
        )

        let combinedItemQty = {}
        order.items.forEach((item) => {
          combinedItemQty[item.product.name] =
            (combinedItemQty[item.product.name] || 0) + 1
        })

        filteredDuplicates.forEach((item) => {
          item.quantity = combinedItemQty[item.product.name]
        })

        order.items = filteredDuplicates

        // console.log('DEBUGGGINGGG')
        // const orderCheckout = order.stripeCheckout as Prisma.JsonObject
        // console.log(
        //   '🚀 ~ file: invoiceApi.ts ~ line 235 ~ resolve ~ orderCheckout',
        //   orderCheckout.id
        // )

        return order
      }
    },
  })
  .query('getInvoicePayments', {
    input: z.object({
      orderId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const orderPayments = await ctx.prisma.orderPayments.findMany({
        where: {
          orderId: input.orderId,
        },
      })

      // console.log({ orderPayments })

      return orderPayments
    },
  })
  .mutation('deleteInvoicePayment', {
    input: z.object({
      paymentId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const deletedPayment = await ctx.prisma.orderPayments.delete({
        where: {
          id: input.paymentId,
        },
      })

      console.log({ deletedPayment })

      if (!!deletedPayment?.confirmed) {
        const getOrderBalance = await ctx.prisma.order.findUniqueOrThrow({
          where: {
            orderId: deletedPayment.orderId,
          },
          select: {
            totalBalancePaid: true,
          },
        })

        const updatedInvoiceTotalBalancePaid = await ctx.prisma.order.update({
          where: {
            orderId: deletedPayment.orderId,
          },
          data: {
            totalBalancePaid:
              getOrderBalance?.totalBalancePaid! - deletedPayment.amountPaid,
          },
        })

        // console.log({ updatedInvoiceTotalBalancePaid })

        const getCustomerBalance = await ctx.prisma.user.findUniqueOrThrow({
          where: {
            id: updatedInvoiceTotalBalancePaid.customerUserId,
          },
          select: {
            currentBalance: true,
          },
        })

        // console.log({ getCustomerBalance })

        const updatedCustomerBalance = await ctx.prisma.user.update({
          where: {
            id: updatedInvoiceTotalBalancePaid.customerUserId,
          },
          data: {
            currentBalance:
              getCustomerBalance?.currentBalance! + deletedPayment.amountPaid,
          },
        })
      }

      return deletedPayment
    },
  })
  .mutation('createInvoicePayment', {
    input: z.object({
      orderId: z.string(),
      amountPaid: z.number(),
      paymentType: z.string(),
    }),
    async resolve({ ctx, input }) {
      const createdPayment = await ctx.prisma.orderPayments.create({
        data: {
          amountPaid: input.amountPaid * 100, //keep in usd cents,
          paymentType: input.paymentType,
          order: {
            connect: {
              orderId: input.orderId,
            },
          },
        },
      })

      return createdPayment
    },
  })
  .mutation('confirmInvoicePayment', {
    input: z.object({
      paymentId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const confirmedPayment = await ctx.prisma.orderPayments.update({
        where: {
          id: input.paymentId,
        },
        data: {
          confirmed: true,
        },
      })

      const getOrderBalance = await ctx.prisma.order.findUniqueOrThrow({
        where: {
          orderId: confirmedPayment.orderId,
        },
        select: {
          totalBalancePaid: true,
        },
      })

      const updatedInvoiceTotalBalancePaid = await ctx.prisma.order.update({
        where: {
          orderId: confirmedPayment.orderId,
        },
        data: {
          totalBalancePaid:
            getOrderBalance?.totalBalancePaid! + confirmedPayment.amountPaid,
        },
      })

      console.log({ updatedInvoiceTotalBalancePaid })

      const getCustomerBalance = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: updatedInvoiceTotalBalancePaid.customerUserId,
        },
        select: {
          currentBalance: true,
        },
      })

      console.log({ getCustomerBalance })

      const updatedCustomerBalance = await ctx.prisma.user.update({
        where: {
          id: updatedInvoiceTotalBalancePaid.customerUserId,
        },
        data: {
          currentBalance:
            getCustomerBalance?.currentBalance! - confirmedPayment.amountPaid,
        },
      })

      console.log({ updatedCustomerBalance })

      return confirmedPayment
    },
  })
  // afterr the payment is confirmed customer balance and total balance paid are changed
  // if payment is unconfirmed, amount paid is added back to customer balacne and total balance paid
  .mutation('unconfirmInvoicePayment', {
    input: z.object({
      paymentId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const deletedPayment = await ctx.prisma.orderPayments.update({
        where: {
          id: input.paymentId,
        },
        data: {
          confirmed: false,
        },
      })

      const getOrderBalance = await ctx.prisma.order.findUniqueOrThrow({
        where: {
          orderId: deletedPayment.orderId,
        },
        select: {
          totalBalancePaid: true,
        },
      })

      const updatedInvoiceTotalBalancePaid = await ctx.prisma.order.update({
        where: {
          orderId: deletedPayment.orderId,
        },
        data: {
          totalBalancePaid:
            getOrderBalance?.totalBalancePaid! - deletedPayment.amountPaid,
        },
      })

      console.log({ updatedInvoiceTotalBalancePaid })

      const getCustomerBalance = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: updatedInvoiceTotalBalancePaid.customerUserId,
        },
        select: {
          currentBalance: true,
        },
      })

      console.log({ getCustomerBalance })

      const updatedCustomerBalance = await ctx.prisma.user.update({
        where: {
          id: updatedInvoiceTotalBalancePaid.customerUserId,
        },
        data: {
          currentBalance:
            getCustomerBalance?.currentBalance! + deletedPayment.amountPaid,
        },
      })

      console.log({ updatedCustomerBalance })

      return deletedPayment
    },
  })
  .mutation('updateRecieverAddress', {
    input: z.object({
      orderId: z.string(),
      updatedAddress: z.object({
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
      try {
        const updatedReciverAddress = await ctx.prisma.order.update({
          where: {
            orderId: input.orderId,
          },
          data: {
            recieverAddress: {
              update: input.updatedAddress,
            },
          },
        })

        return true
      } catch (error) {
        throw error
      }
    },
  })
  .mutation('removeEnitreItemFromOrder', {
    input: z.object({
      // cartItemId: z.bigint(),
      productId: z.bigint(),
      orderId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const removedItems = await ctx.prisma.orderItem.deleteMany({
          where: {
            productId: input.productId,
          },

          // select: {
          //   // quantity: true,
          //   product: {
          //     select: {
          //       price: true,
          //     },
          //   },
          // },
        })

        const productPrice = await ctx.prisma.product.findUnique({
          where: {
            id: input.productId,
          },
          select: {
            price: true,
          },
        })

        let totalCost = await ctx.prisma.order.findUnique({
          where: {
            orderId: input.orderId,
          },
          select: {
            totalCost: true,
          },
        })

        if (totalCost === undefined) throw 'total cart balance not found'

        const totalCostAfterRemove = await ctx.prisma.order.update({
          where: {
            orderId: input.orderId,
          },
          data: {
            totalCost:
              totalCost?.totalCost! - removedItems.count * productPrice?.price!,
          },
          select: {
            totalCost: true,
          },
        })

        const getCustomerBalance = await ctx.prisma.order.findUniqueOrThrow({
          where: {
            orderId: input.orderId,
          },
          include: {
            customer: {
              select: {
                currentBalance: true,
                id: true,
              },
            },
          },
        })

        const updatedCustomerBalance = await ctx.prisma.user.update({
          where: {
            id: getCustomerBalance.customer.id,
          },
          data: {
            currentBalance:
              getCustomerBalance?.customer?.currentBalance! -
              removedItems.count * productPrice?.price!,
          },
        })

        return true
      } catch (error) {
        throw error
      }
    },
  })
  .mutation('removeItemFromOrder', {
    input: z.object({
      cartItemId: z.bigint(),
      // productId: z.bigint(),
      orderId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const removedItem = await ctx.prisma.orderItem.delete({
          where: {
            id: input.cartItemId,
          },

          select: {
            // quantity: true,
            product: {
              select: {
                price: true,
              },
            },
          },
        })

        let totalCost = await ctx.prisma.order.findUnique({
          where: {
            orderId: input.orderId,
          },
          select: {
            totalCost: true,
          },
        })

        if (totalCost === undefined) throw 'total cart balance not found'

        const totalCostAfterRemove = await ctx.prisma.order.update({
          where: {
            orderId: input.orderId,
          },
          data: {
            totalCost: totalCost?.totalCost! - removedItem.product.price,
          },
          select: {
            totalCost: true,
          },
        })

        const getCustomerBalance = await ctx.prisma.order.findUniqueOrThrow({
          where: {
            orderId: input.orderId,
          },
          include: {
            customer: {
              select: {
                currentBalance: true,
                id: true,
              },
            },
          },
        })

        const updatedCustomerBalance = await ctx.prisma.user.update({
          where: {
            id: getCustomerBalance.customer.id,
          },
          data: {
            currentBalance:
              getCustomerBalance?.customer?.currentBalance! -
              removedItem.product.price,
          },
        })

        return totalCostAfterRemove.totalCost
      } catch (error) {
        throw error
      }
    },
  })
  .mutation('addOneItem', {
    input: z.object({
      // cartItemId: z.bigint(),
      productId: z.bigint(),
      orderId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const addedItem = await ctx.prisma.orderItem.create({
          // where: {
          //   CartItemId: {
          //     productId: input.item.productId,
          //     cartId: cartId,
          //   },
          // },
          data: {
            productId: input.productId,
            // quantity: input.item.amount,
            orderId: input.orderId,
          },
          // update: {
          //   quantity: input.item.amount + prevQty,
          // },
          include: {
            product: {
              select: {
                price: true,
              },
            },
          },
        })

        let totalCost = await ctx.prisma.order.findUnique({
          where: {
            orderId: input.orderId,
          },
          select: {
            totalCost: true,
          },
        })
        if (totalCost === null) throw 'total cost undefined'

        const updatedOrderTotal = await ctx.prisma.order.update({
          where: {
            orderId: input.orderId,
          },
          // data: {
          //   totalCost: totalCost + addedItem.product.price * input.item.amount,
          // },
          data: {
            totalCost: totalCost?.totalCost! + addedItem?.product?.price!,
          },
        })

        const getCustomerBalance = await ctx.prisma.order.findUniqueOrThrow({
          where: {
            orderId: input.orderId,
          },
          include: {
            customer: {
              select: {
                currentBalance: true,
                id: true,
              },
            },
          },
        })

        const updatedCustomerBalance = await ctx.prisma.user.update({
          where: {
            id: getCustomerBalance.customer.id,
          },
          data: {
            currentBalance:
              getCustomerBalance?.customer?.currentBalance! +
              addedItem?.product?.price!,
          },
        })

        return addedItem
      } catch (error) {
        throw error
      }
    },
  })
  .mutation('addProductToOrder', {
    input: z.object({
      // cartItemId: z.bigint(),
      // productId: z.bigint(),
      orderId: z.string(),
      item: z.object({
        quantity: z.number(),
        productId: z.bigint(),
      }),
    }),
    async resolve({ ctx, input }) {
      try {
        let itemMultiplied = []

        for (let index = 0; index < input.item.quantity; index++) {
          itemMultiplied.push({
            productId: input.item.productId,
            orderId: input.orderId,
          })
        }

        const addedItem = await ctx.prisma.orderItem.createMany({
          data: itemMultiplied,
        })

        let totalCost = await ctx.prisma.order.findUnique({
          where: {
            orderId: input.orderId,
          },
          select: {
            totalCost: true,
          },
        })
        if (totalCost === null) throw 'total cost undefined'

        const productPrice = await ctx.prisma.product.findUnique({
          where: {
            id: input.item.productId,
          },
          select: {
            price: true,
          },
        })

        const updatedOrderTotal = await ctx.prisma.order.update({
          where: {
            orderId: input.orderId,
          },
          // data: {
          //   totalCost: totalCost + addedItem.product.price * input.item.amount,
          // },
          data: {
            totalCost:
              totalCost?.totalCost! +
              productPrice?.price! * input.item.quantity,
          },
        })

        const getCustomerBalance = await ctx.prisma.order.findUniqueOrThrow({
          where: {
            orderId: input.orderId,
          },
          include: {
            customer: {
              select: {
                currentBalance: true,
                id: true,
              },
            },
          },
        })

        const updatedCustomerBalance = await ctx.prisma.user.update({
          where: {
            id: getCustomerBalance.customer.id,
          },
          data: {
            currentBalance:
              getCustomerBalance?.customer?.currentBalance! +
              productPrice?.price! * input.item.quantity,
          },
        })

        return addedItem
      } catch (error) {
        throw error
      }
    },
  })
