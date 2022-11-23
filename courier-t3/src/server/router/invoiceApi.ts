import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { createProtectedRouter } from './protected-routers'

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
      console.log(
        '🚀 ~ file: invoiceApi.ts ~ line 62 ~ resolve ~ orders',
        orders
      )

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

              orders[obj][key] = orders[obj][key].toLocaleString('en-US')
            }

        let data = { orders: orders, orderCount: orderCount }
        return data
      }
    },
  })
  .mutation('changeOrderPickupDriver', {
    input: z.object({
      orderId: z.number(),
      newPickUpDriverId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const id = input.orderId
      const driverId = input.newPickUpDriverId
      // console.log('updateorderpickupdriver by id:', id, driverId)
      const changedPickupDriver = await ctx.prisma.order.update({
        where: {
          id: id,
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
          pickupDriver: true,
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
      orderIds: z.object({
        // id: z.string()
      }),
      newPickUpDriverId: z.string(),
    }),
    async resolve({ ctx, input }) {
      console.log('OrderIds:', input.orderIds)
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
      return changedManyOrdersPickupDriver
    },
  })
  .query('getOrderById', {
    input: z.object({
      orderId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const order = await ctx.prisma.order.findUnique({
        where: {
          id: input.orderId,
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
          addresses: {
            select: {
              firstName: true,
              lastName: true,
              address: true,
              address2: true,
              address3: true,
              city: true,
              postalCode: true,
              cellphone: true,
              telephone: true,
              country: true,
            },
          },
          items: {
            select: {
              quantity: true,
              product: {
                select: {
                  price: true,
                  name: true,
                  stripeProductId: true,
                },
              },
            },
          },
          status: {
            select: {
              message: true,
            },
          },
          timePlaced: true,
          stripeCheckout: true,
        },
      })
      if (order) {
        // changing timePlaced for orders into readable local values
        for (const key in order)
          if (key === 'timePlaced') {
            order[key] = order[key].toLocaleString()
          }

        // const QRStringEncrypted = `OrderID:${order?.id}\nSender:${
        //   order?.customer.firstName
        // } ${order?.customer.lastName}\n  Country: ${
        //   order?.addresses[0]?.country
        // }\n  Address: ${order?.addresses[0]?.address}\n  Address2: ${
        //   order?.addresses[0]?.address2 || 'N/A'
        // }\n  Address3: ${order?.addresses[0]?.address3 || ' N/A'}\n  City: ${
        //   order?.addresses[0]?.city
        // }\n  PostalCode: ${order?.addresses[0]?.postalCode}\n  Cellphone: ${
        //   order?.addresses[0]?.cellphone || 'N/A'
        // }\n  Telephone: ${order?.addresses[0]?.telephone || 'N/A'}\nReciever: ${
        //   order?.addresses[1]?.firstName
        // }\n  Country: ${order?.addresses[1]?.country}\n  Address: ${
        //   order?.addresses[1]?.address
        // }\n  Address2: ${order?.addresses[1]?.address2 || 'N/A'}\n  Address3: ${
        //   order?.addresses[1]?.address3 || ' N/A'
        // }\n  City: ${order?.addresses[1]?.city}\n  PostalCode: ${
        //   order?.addresses[1]?.postalCode
        // }\n  Cellphone: ${
        //   order?.addresses[1]?.cellphone || 'N/A'
        // }\n  Telephone: ${order?.addresses[1]?.telephone || 'N/A'}`

        const orderCheckout = order.stripeCheckout as Prisma.JsonObject
        console.log(
          '🚀 ~ file: invoiceApi.ts ~ line 235 ~ resolve ~ orderCheckout',
          orderCheckout.id
        )

        return order
      }
    },
  })
