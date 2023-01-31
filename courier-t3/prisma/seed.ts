import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import Stripe from 'stripe'

let stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
})
// TODO: add user roles,
async function main() {
  const testUsers = await prisma.user.createMany({
    data: [
      {
        email: 'ADMIN@email.com',
        firstName: 'ADMININSTRATOR',
        lastName: 'ADMIN',
        role: 'ADMIN',
        // password: 'gW3H5mg2#!dWjcgd#*@L',
        password: 'admin123',
      },
      {
        email: 'CustomerTester@email.com',
        firstName: 'Customer',
        lastName: 'Tester',
        role: 'CUSTOMER',
        password: '123',
      },
      {
        email: 'driverTester@email.com',
        firstName: 'driver',
        lastName: 'Tester',
        role: 'DRIVER',
        password: '123',
      },
    ],
  })

  // const orderPickupZones = await prisma.
  const invoiceStatuses = await prisma.orderStatus.createMany({
    data: [
      { message: 'pending payment' },
      {
        message: 'With Pickup Driver',
      },
      {
        message: 'At NYC warehouse',
      },
      {
        message: 'In Container',
      },
      {
        message: 'At DR warehouse',
      },
      {
        message: 'Out for delivery',
      },
      {
        message: 'delivered to reciever',
      },
    ],
  })
  console.log('✅ ~ file: seed.ts ~ line 24 ~ main ~ testUsers', testUsers)

  let testItems = {
    box_of_food: 'prod_Mk1cllh17mhqES',
    couch: 'prod_MlnaiO29x1pqpk',
  }

  async function addStripeProductToDBbyStripeProductId(itemId: string) {
    const product = await stripe.products.retrieve(itemId, {
      expand: ['default_price'],
    })

    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        //@ts-ignore
        price: product.default_price.unit_amount,
        stripeProductId: product.id,

        //! these types are erroring but they exist under type Stripe.Price, the data is returned correctly from stripe
        //@ts-ignore
        stripePriceId: product?.default_price?.id,
      },
    })
    console.log(
      '🚀 ~ file: testingFile.mjs ~ line 35 ~ addStripeProductToDBbyStripeProductId ~ createdProduct',
      createdProduct
    )
  }
  for (const [key, value] of Object.entries(testItems)) {
    console.log(`${key}: ${value}`)
    await addStripeProductToDBbyStripeProductId(value)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
