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
          stripePriceId: true,
          stripeProductId: true,
          // productType: {
          //   select: {
          //     type: true,
          //   },
          // },
        },
      })

      return products
    },
  })
// .query('getAllProductTypes', {
//   async resolve({ ctx }) {
//     const productTypes = await ctx.prisma.productType.findMany({
//       select: {
//         type: true,
//       },
//     })

//     // this was used when type select in create new product was based on the id of the type instead of its string name
//     let typeArray = []
//     for (const typeObject of productTypes) {
//       // typeArray.push(typeObject.id.toString())
//       typeArray.push(typeObject.type)
//     }

//     // console.log(
//     //   '🚀 ~ file: publicApi.ts ~ line 51 ~ resolve ~ typeArray',
//     //   typeArray
//     // )
//     // console.log(typeArray)

//     productTypes.unshift({
//       // id: -1,
//       type: 'PICK A TYPE',
//     })
//     console.log(
//       '🚀 ~ file: publicApi.ts ~ line 65 ~ resolve ~ productTypes',
//       productTypes
//     )

//     // console.log(productTypes)

//     return {
//       productTypes: productTypes,
//       typeArray: typeArray,
//     }
//   },
// })
