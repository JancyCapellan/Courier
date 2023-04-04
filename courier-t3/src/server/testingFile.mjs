// import { env } from '../env/server.mjs'
// import Stripe from 'stripe'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'

import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

main()

async function main() {
  const randomCustomers =
    await prisma.$queryRaw`SELECT * FROM "User" ORDER BY RANDOM() LIMIT 10;`
  console.log({ randomCustomers })

  let customerIds = []

  randomCustomers.forEach((customer) => {
    customerIds.push(customer.id)
  })
  const createCustomersOrders = await prisma.order.createMany({
    data: {},
  })
}

// function main() {
//   dayjs.extend(utc)
//   dayjs.extend(localizedFormat)

//   const nowutc = dayjs.utc()
//   console.log({ nowutc })
//   const now = nowutc.local().format('L LT')
//   console.log({ now })
//   return now
// }

// async function createMockOrdersExcludingStripe() {
//   pendingOrder = await ctx.prisma.order.create({
//     data: {
//       customer: {
//         connect: {
//           id: input.customerId,
//         },
//       },
//       creatorUser: {
//         connect: {
//           id: input.userId,
//         },
//       },
//       paymentType: input.paymentType,
//       paymentStatuses: {
//         connectOrCreate: {
//           where: {
//             status: 'PENDING PAYMENT',
//           },
//           create: {
//             status: 'PENDING PAYMENT',
//           },
//         },
//       },
//       totalCost: cartSession?.totalCost,
//       status: {
//         connectOrCreate: {
//           where: {
//             message: 'awaiting pickup',
//           },
//           create: {
//             message: 'awaiting pickup',
//           },
//         },
//       },
//       items: {
//         createMany: {
//           //@ts-ignore
//           data: cartSession?.items,
//         },
//       },
//       addresses: {
//         createMany: {
//           //@ts-ignore
//           data: cartSession?.addresses,
//         },
//       },
//       stripeCheckoutId:
//         // made this way becuase not all orders go through stripe so some may need an empty column, i dont remember why null doesnt work because i could avoid this if input.stripeCheckoutId is null from not exising already from creating the checkout order
//         input.stripeCheckoutId !== null // this was the problem stopping the webhook from updating pending order
//           ? input.stripeCheckoutId
//           : undefined,
//       stripeCheckoutUrl: input.stripeCheckoutUrl,
//       // stripePaymentIntent: input?.stripePaymentIntent,
//     },
//     include: {
//       items: true,
//     },
//   })
// }

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2022-11-15',
// })

// const getCheckoutSession = await stripe.checkout.sessions.retrieve(
//   'cs_test_b1sMwShM6rnz0VUfO7LeHqTxNdkDKL8U9EppAljCNniKOzmZnuL3RCbE6c'
// )
// console.log(
//   '🚀 ~ file: testingFile.mjs:10 ~ getCheckoutSession:',
//   getCheckoutSession
// )

// const expiredSession = await stripe.checkout.sessions.expire(
//   'cs_test_b1RHe1dcl3M0ZtxabCirZeXuGXoVKmX1W4BF2Baddg5Tp3w51uJFj0DtyP'
// )
// console.log('🚀 ~ file: testingFile.mjs:21 ~ expiredSession:', expiredSession)

// async function addStripeProductToDBbyStripeProductId(itemId) {
//   const product = await stripe.products.retrieve(itemId, {
//     expand: ['default_price'],
//   })
//   console.log(
//     '🚀 ~ file: testingFile.mjs ~ line 17 ~ addStripeProductToDBbyStripeProductId ~ product',
//     product
//   )

//   const createdProduct = await prisma.product.create({
//     data: {
//       name: product.name,
//       price: product.default_price.unit_amount,
//       stripeProductId: product.id,
//       stripePriceId: product.default_price.id,
//     },
//   })
//   console.log(
//     '🚀 ~ file: testingFile.mjs ~ line 35 ~ addStripeProductToDBbyStripeProductId ~ createdProduct',
//     createdProduct
//   )
// }

// async function main() {
//   let testItems = {
//     box_of_food: 'prod_Mk1cllh17mhqES',
//     couch: 'prod_MlnaiO29x1pqpk',
//   }

//   for (const [key, value] of Object.entries(testItems)) {
//     console.log(`${key}: ${value}`)
//     await addStripeProductToDBbyStripeProductId(value)
//   }
// }

// async function prismaTest() {
//   const cartSession = await prisma.cart.findUnique({
//     where: {
//       creatingUserId_customerId: {
//         creatingUserId: 'clar9ccid000017n0far2vmby',
//         customerId: 'clar9ccid000117n0m9uxhb6t',
//       },
//     },
//     select: {
//       cartId: true,
//       customerId: true,
//       creatingUserId: true,
//       items: {
//         select: {
//           quantity: true,
//           productId: true,
//         },
//       },
//       addresses: {
//         select: {
//           firstName: true,
//           lastName: true,
//           address: true,
//           address2: true,
//           address3: true,
//           city: true,
//           state: true,
//           postalCode: true,
//           country: true,
//           cellphone: true,
//           telephone: true,
//           recipient: true,
//         },
//       },
//     },
//   })
//   console.log(
//     '🚀 ~ file: testingFile.mjs ~ line 88 ~ prismaTest ~ cartSession',
//     cartSession
//   )
//   const pendingOrder = await prisma.order.create({
//     data: {
//       customer: {
//         connect: {
//           id: 'clar9ccid000117n0m9uxhb6t',
//         },
//       },
//       creatorUser: {
//         connect: {
//           id: 'clar9ccid000017n0far2vmby',
//         },
//       },
//       paymentType: 'STRIPE',
//       status: {
//         connectOrCreate: {
//           where: {
//             message: 'PENDING PAYMENT',
//           },
//           create: {
//             message: 'PENDING PAYMENT',
//           },
//         },
//       },
//       items: {
//         createMany: {
//           data: cartSession?.items,
//         },
//       },
//       addresses: {
//         createMany: {
//           data: cartSession?.addresses,
//         },
//       },
//       stripeCheckoutId: 'ck_test_thiscommesfromCreateCheckoutSession',
//     },
//     include: {
//       items: true,
//     },
//   })
//   console.log(
//     '🚀 ~ file: testingFile.mjs ~ line 106 ~ prismaTest ~ pendingOrder',
//     pendingOrder
//   )

//   const deleteCartSession = await prisma.cart.delete({
//     where: {
//       creatingUserId_customerId: {
//         creatingUserId: 'clar9ccid000017n0far2vmby',
//         customerId: 'clar9ccid000117n0m9uxhb6t',
//       },
//     },
//   })
//   console.log(
//     '🚀 ~ file: testingFile.mjs ~ line 140 ~ prismaTest ~ deleteCartSession',
//     deleteCartSession
//   )
// }

// async function checkoutNoPriceId() {
//   const session = await stripeS.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'T-shirt',
//           },
//           unit_amount: 2000,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `http://localhost:3000/Invoices`,
//     cancel_url: `http://localhost:3000/account`,
//   })

//   console.log('session', session)
// }

// checkoutNoPriceId()
