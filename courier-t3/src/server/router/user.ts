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
  .query('getUserEmail', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        // console.log('userId for user account info:', input)
        const userEmail = await ctx.prisma.user.findUnique({
          where: { id: input.userId },
          select: {
            email: true,
            emailVerified: true,
          },
        })
        console.log({ userEmail })
        return userEmail
      } catch (error) {
        // throw error
        console.error(error)
      }
    },
  })
  .query('getAddresses', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const addresses = await ctx.prisma.userAddress.findMany({
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
  .query('getDeliveryAddresses', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const addresses = await ctx.prisma.userDeliveryAddress.findMany({
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
        const addedAddress = await ctx.prisma.userAddress.create({
          data: input.addressForm,
        })
        console.log('ADDED address:', addedAddress)
        return addedAddress
      } catch (error) {
        console.error(error)
      }
    },
  })
  .mutation('addDeliveryAddress', {
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
        const addedAddress = await ctx.prisma.userDeliveryAddress.create({
          data: input.addressForm,
        })
        console.log('ADDED delivery address:', addedAddress)
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
            customerUserId: input.userId,
          },
          include: {
            status: true,
            items: {
              include: {
                product: {
                  select: {
                    price: true,
                    name: true,
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
  .mutation('changeUserAddress', {
    input: z.object({
      addressId: z.number(),
      form: z.object({
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
        const updatedAddressResult = await ctx.prisma.userAddress.update({
          where: {
            id: input.addressId,
          },
          data: input.form,
        })

        return updatedAddressResult
      } catch (e) {
        throw e
      }
    },
  })
  .mutation('changeDeliveryAddress', {
    input: z.object({
      addressId: z.number(),
      form: z.object({
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
        const updatedAddressResult =
          await ctx.prisma.userDeliveryAddress.update({
            where: {
              id: input.addressId,
            },
            data: input.form,
          })

        return updatedAddressResult
      } catch (e) {
        throw e
      }
    },
  })
  .mutation('deleteAddress', {
    input: z.object({
      addressId: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const updatedAddressResult = await ctx.prisma.userAddress.delete({
          where: {
            id: input.addressId,
          },
        })

        return updatedAddressResult
      } catch (e) {
        throw e
      }
    },
  })
  .mutation('deleteDeliveryAddress', {
    input: z.object({
      addressId: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const updatedAddressResult =
          await ctx.prisma.userDeliveryAddress.delete({
            where: {
              id: input.addressId,
            },
          })

        return updatedAddressResult
      } catch (e) {
        throw e
      }
    },
  })
