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
        const registrationSuccessful = await prisma.user.create({
          data: input,
        })
        console.log('Registartion Successful:', registrationSuccessful)
        return { message: 'Registartion Successful:', registrationSuccessful }
      } catch (error) {
        throw error
      }
    },
  })
  .query('login')
