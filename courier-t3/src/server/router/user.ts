import { string, z } from 'zod'
import { createProtectedRouter } from './protected-routers'

import { TRPCError } from '@trpc/server'

export const userRouter = createProtectedRouter()
  .query('getUserAccountInfo', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        // console.log('userId for user account info:', input)
        const user = await ctx.prisma.user.findUnique({
          where: { id: input.userId },
        })
        return user
      } catch (error) {
        throw error
      }
    },
  })
  .query('getAddresses', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const addresses = await ctx.prisma.address.findMany({
          where: {
            userId: input.userId,
          },
        })

        return addresses
      } catch (error) {
        throw error
      }
    },
  })
  .mutation('addAddress', {
    input: z.object({
      userId: z.string(),
      addressForm: z.object({
        userId: z.string(),
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
      try {
        const addedAddress = await ctx.prisma.address.create({
          data: input.addressForm,
        })
        console.log(addedAddress)
        return addedAddress
      } catch (error) {
        console.error(error)
      }
    },
  })
  .mutation('editUserInformation', {
    input: z.object({
      userId: z.string(),
      form: z.object({
        firstName: z.string(),
        middleName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        preferredLanguage: z.string(),
      }),
    }),
    async resolve({ ctx, input }) {
      try {
        // console.log(input)
        const updatedUserInfo = await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: input.form,
        })

        return updatedUserInfo
      } catch (error) {
        console.error(error)
      }
    },
  })
  .query('getUserOrders', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const userOrders = await ctx.prisma.order.findMany({
          where: {
            userId: input.userId,
          },
          include: {
            status: true,
            items: {
              include: {
                product: {
                  select: {
                    price: true,
                    name: true,
                    productType: {
                      select: {
                        type: true,
                      },
                    },
                  },
                },
              },
            },
            addresses: true,
          },
        })

        // if userOrders array is empty, have to check if user even exists
        if (!userOrders?.length) return []
        if (userOrders) {
          // changing timePlaced for orders into readable local values
          // time is in 2021-11-01T16:23:29.139Z format, UTC
          for (const obj in userOrders)
            for (const key in userOrders[obj])
              if (key === 'timePlaced') {
                userOrders[obj][key] =
                  userOrders[obj][key].toLocaleString('en-US')
              }

          console.log(userOrders)
          return userOrders
        }
      } catch (error) {}
    },
  })
