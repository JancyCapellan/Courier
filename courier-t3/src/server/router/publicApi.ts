import { createRouter } from './context'
import { z } from 'zod'

export const publicApiRouter = createRouter()
  .mutation('register', {
    input: z.object({
      firstName: z.string(),
      middleName: z.string().optional(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string(),
      role: z.enum(['CUSTOMER', 'ADMIN', 'DRIVER', 'STAFF']), //TODO: TYPEDEF
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
  .query('getAllProducts', {
    async resolve({ ctx }) {
      const products = await ctx.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          productType: {
            select: {
              type: true,
            },
          },
        },
      })

      return products
    },
  })
  .query('getAllProductTypes', {
    async resolve({ ctx }) {
      const productTypes = await ctx.prisma.productType.findMany()

      let typeArray = []
      for (const typeObject of productTypes) {
        typeArray.push(typeObject.id.toString())
      }

      console.log(typeArray)

      productTypes.unshift({
        id: -1,
        type: 'PICK A TYPE',
      })

      console.log(productTypes)

      return {
        productTypes: productTypes,
        typeArray: typeArray,
      }
    },
  })
