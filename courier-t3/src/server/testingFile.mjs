import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import Stripe from 'stripe'

let stripe = new Stripe(
  'pk_test_51LzM1PAVJ8VmRrvGMfJYfnV9dE48TNihwO5NRrHOb8qWiRttQVsZUPPBbC2kYMijzO4LmXU1RWC4dTDs5GK2PcU300e8ev53xN',
  {
    apiVersion: '2022-08-01',
  }
)

async function addStripeProductToDBbyStripeProductId(itemId) {
  const product = await stripe.products.retrieve(itemId, {
    expand: ['default_price'],
  })
  console.log(
    '🚀 ~ file: testingFile.mjs ~ line 17 ~ addStripeProductToDBbyStripeProductId ~ product',
    product
  )

  const createdProduct = await prisma.product.create({
    data: {
      name: product.name,
      price: product.default_price.unit_amount,
      stripeProductId: product.id,
      stripePriceId: product.default_price.id,
    },
  })
  console.log(
    '🚀 ~ file: testingFile.mjs ~ line 35 ~ addStripeProductToDBbyStripeProductId ~ createdProduct',
    createdProduct
  )
}

async function main() {
  let testItems = {
    box_of_food: 'prod_Mk1cllh17mhqES',
    couch: 'prod_MlnaiO29x1pqpk',
  }

  for (const [key, value] of Object.entries(testItems)) {
    console.log(`${key}: ${value}`)
    await addStripeProductToDBbyStripeProductId(value)
  }
}

async function prismaTest() {
  const cartSession = await prisma.cart.findUnique({
    where: {
      creatingUserId_customerId: {
        creatingUserId: 'clar9ccid000017n0far2vmby',
        customerId: 'clar9ccid000117n0m9uxhb6t',
      },
    },
    select: {
      cartId: true,
      customerId: true,
      creatingUserId: true,
      items: {
        select: {
          quantity: true,
          productId: true,
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
          state: true,
          postalCode: true,
          country: true,
          cellphone: true,
          telephone: true,
          recipient: true,
        },
      },
    },
  })
  console.log(
    '🚀 ~ file: testingFile.mjs ~ line 88 ~ prismaTest ~ cartSession',
    cartSession
  )
  const pendingOrder = await prisma.order.create({
    data: {
      customer: {
        connect: {
          id: 'clar9ccid000117n0m9uxhb6t',
        },
      },
      creatorUser: {
        connect: {
          id: 'clar9ccid000017n0far2vmby',
        },
      },
      paymentType: 'STRIPE',
      status: {
        connectOrCreate: {
          where: {
            message: 'PENDING PAYMENT',
          },
          create: {
            message: 'PENDING PAYMENT',
          },
        },
      },
      items: {
        createMany: {
          data: cartSession?.items,
        },
      },
      addresses: {
        createMany: {
          data: cartSession?.addresses,
        },
      },
      stripeCheckoutId: 'ck_test_thiscommesfromCreateCheckoutSession',
    },
    include: {
      items: true,
    },
  })
  console.log(
    '🚀 ~ file: testingFile.mjs ~ line 106 ~ prismaTest ~ pendingOrder',
    pendingOrder
  )

  const deleteCartSession = await prisma.cart.delete({
    where: {
      creatingUserId_customerId: {
        creatingUserId: 'clar9ccid000017n0far2vmby',
        customerId: 'clar9ccid000117n0m9uxhb6t',
      },
    },
  })
  console.log(
    '🚀 ~ file: testingFile.mjs ~ line 140 ~ prismaTest ~ deleteCartSession',
    deleteCartSession
  )
}

prismaTest()
