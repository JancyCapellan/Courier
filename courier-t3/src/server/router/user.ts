import { createRouter } from './context'
import { z } from 'zod'

export const userRouter = createRouter()
  .mutation('register', {
    input: z.object({
      firstName: z.string(),
      middleName: z.string().optional(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string(),
      role: z.enum(['CUSTOMER', 'ADMIN']), //TODO: TYPEDEF
    }),
    async resolve({ ctx, input }) {
      try {
        console.log('registartion form:', input)
        const registrationSuccessful = await ctx.prisma.user.create({
          data: input,
        })
        console.log('Registartion Successful:', registrationSuccessful)
        return { message: 'Registartion Successful:', registrationSuccessful }
      } catch (error) {
        throw error
      }
    },
  })
  .query('getUserAccountInfo', {
    input: z.object({
      userId: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        // console.log('userId for user account info:', input)
        const user = await ctx.prisma.user.findUnique({ where: { id: input.userId } })
        return user
      } catch (error) {
        throw error
      }
    },
  })
