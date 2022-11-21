// @ts-nocheck
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

main()
