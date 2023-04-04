import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const range = (len: any) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newCustomer = () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  return {
    firstName: firstName,
    middleName: faker.name.middleName(),
    lastName: lastName,
    email: faker.internet.email(firstName, lastName, 'email.com'),
    password: '123',
    role: 'CUSTOMER',
  }
}

export function makeCustomerData(...lens: number[]) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map((d) => {
      return {
        ...newCustomer(),
        // subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}

async function makeManyCustomer(lens: number) {
  const customers = makeCustomerData(lens)

  const createdCustomers = await prisma.user.createMany({
    data: customers,
  })

  console.log({ createdCustomers })
}

async function main() {
  makeManyCustomer(250)
  const testUsers = await prisma.user.createMany({
    data: [
      {
        email: 'owner@email.com',
        firstName: 'Owner',
        lastName: 'Tester',
        role: 'ADMIN',
        password: 'admin123',
      },
      {
        email: 'ADMIN@email.com',
        firstName: 'ADMININSTRATOR',
        lastName: 'ADMIN',
        role: 'ADMIN',
        password: 'admin123',
      },
      {
        email: 'jancycapellan97@email.com',
        firstName: 'jancy',
        lastName: 'capellan',
        role: 'ADMIN',
        password: '123',
      },
      {
        email: 'customerTester@email.com',
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
      {
        email: 'johnTester@email.com',
        firstName: 'John',
        lastName: 'Tester',
        role: 'DRIVER',
        password: '123',
      },
    ],
  })

  console.log({ testUsers })

  // const orderPickupZones = await prisma.
  const invoiceStatuses = await prisma.orderStatus.createMany({
    data: [
      { message: 'awaiting pickup' },
      {
        message: 'With Pickup Driver',
      },
      {
        message: 'Arrived at NYC warehouse',
      },
      {
        message: 'In Transit to Next Facility',
      },
      {
        message: 'Arrived at DR warehouse',
      },
      {
        message: 'Out for delivery',
      },
      {
        message: 'delivered to reciever',
      },
    ],
  })

  const paymentStatuses = await prisma.paymentStatus.createMany({
    data: [
      { status: 'pending payment' },
      { status: 'PAID' },
      { status: 'CANCELLED' },
    ],
  })
  // console.log('✅ ~ file: seed.ts ~ line 24 ~ main ~ testUsers', testUsers)

  // let testItems = {
  //   box_of_food: 'prod_Mk1cllh17mhqES',
  //   couch: 'prod_MlnaiO29x1pqpk',
  // }

  // async function addStripeProductToDBbyStripeProductId(itemId: string) {
  //   const product = await stripe.products.retrieve(itemId, {
  //     expand: ['default_price'],
  //   })

  //   const createdProduct = await prisma.product.create({
  //     data: {
  //       name: product.name,
  //       //@ts-ignore
  //       price: product.default_price.unit_amount,
  //       stripeProductId: product.id,

  //       //! these types are erroring but they exist under type Stripe.Price, the data is returned correctly from stripe
  //       //@ts-ignore
  //       stripePriceId: product?.default_price?.id,
  //     },
  //   })
  //   console.log(
  //     '🚀 ~ file: testingFile.mjs ~ line 35 ~ addStripeProductToDBbyStripeProductId ~ createdProduct',
  //     createdProduct
  //   )
  // }
  // for (const [key, value] of Object.entries(testItems)) {
  //   console.log(`${key}: ${value}`)
  //   await addStripeProductToDBbyStripeProductId(value)
  // }

  // create base products in local database

  interface defaultItems {
    name: string
    price: number
  }
  let defaultItems: defaultItems[] = [
    { name: 'Box Of Used CLothes', price: 150 * 100 },
    { name: 'Box Of new CLothes', price: 200 * 100 },
    { name: 'Box Of food', price: 125 * 100 },
    { name: 'Box ', price: 75 * 100 },
  ]
  try {
    //$100.25 to 10025cents
    // const stripePriceFormat = input.item_price * 100
    const newItems = await prisma.product.createMany({
      data: defaultItems,
    })
    console.log(
      '🚀 ~ file: staffApi.ts ~ line 100 ~ resolve ~ newItem',
      newItems
    )

    return true
  } catch (error) {
    console.error('delete product error', error)
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
