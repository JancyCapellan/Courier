import { z } from 'zod'
import { createProtectedRouter } from './protected-router'

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
        const result = await ctx.prisma.address.create({
          data: input.addressForm,
        })
        console.log(result)
      } catch (error) {}
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
