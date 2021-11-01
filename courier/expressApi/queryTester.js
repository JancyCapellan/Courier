const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// async function main() {
//   // ... you will write your Prisma Client queries here

//   const order = {
//     cart: [
//       {
//         name: 'Prod. Niños',
//         quantity: 1,
//         productsId: '0762',
//         price: 75,
//       },
//       {
//         name: 'Tanq. Misc',
//         quantity: 1,
//         productsId: '0704',
//         price: 75,
//       },
//       {
//         name: 'Tanq Ropa/Zap',
//         quantity: 1,
//         productsId: '0701',
//         price: 75,
//       },
//       {
//         name: 'Mesas',
//         quantity: 1,
//         productsId: '0724',
//         price: 75,
//       },
//     ],
//     total_price: 300,
//     quantity_items: 4,
//     form: {
//       shipper: {
//         userId: 1,
//         firstName: 'Jancy',
//         lastName: 'Capellan',
//         shippedFrom: {
//           address: '314 East 100st apt 6f',
//           address2: '',
//           address3: '',
//           city: 'New York City',
//           state: 'NY',
//           postalCode: 10029,
//           country: '',
//           cellphone: '3475209701',
//           telephone: null,
//           default: false,
//         },
//       },
//       reciever: {
//         firstName: 'Jessica',
//         lastName: 'jones',
//         shippedTo: {
//           address: '471 Santiago rd',
//           address2: '',
//           address3: '',
//           city: 'santiago',
//           state: 'DR',
//           postalCode: 14379,
//           country: 'DR',
//           cellphone: '1345219999',
//           telephone: null,
//           recipient: true,
//         },
//       },
//     },
//     userId: 1,
//   }

//   // make sure address and order are transaction safe
//   // let shippedFromCreate
//   // let ShippedToCreate
//   // try {
//   //   ;[shippedFromCreate, ShippedToCreate] = await prisma.$transaction([
//   //     prisma.address.create({ data: order.form.shipper.shippedFrom }),
//   //     prisma.address.create({ data: order.form.reciever.shippedTo }),
//   //   ])
//   // } catch (error) {
//   //   console.log('Address Create Error')
//   //   throw error
//   // }

//   // create many does not return ids, so this the only way i can think of.
//   // let shippedFromCreate = await prisma.address.create({ data: order.form.shipper.shippedFrom })
//   // let ShippedToCreate = await prisma.address.create({ data: order.form.reciever.shippedTo })

//   // let shippedFrom = shippedFromCreate.id
//   // let shippedTo = -1
//   // let shippedTo = ShippedToCreate.id

//   let info = {
//     userId: order.userId,
//     recieverFirstName: order.form.reciever.firstName,
//     recieverLastName: order.form.reciever.lastName,
//     totalItems: 14, //order.quantity_items,
//     totalPrice: 14 * 75, //order.total_price,
//     items: {
//       createMany: {
//         data: [
//           {
//             quantity: 1,
//             productsId: 762,
//           },
//           {
//             quantity: 13,
//             productsId: 704,
//           },
//           // {
//           //   quantity: 1,
//           //   productsId: 701,
//           // },
//           // {
//           //   quantity: 1,
//           //   productsId: 724,
//           // },
//         ],
//       },
//     },
//     addresses: {
//       createMany: { data: [order.form.shipper.shippedFrom, order.form.reciever.shippedTo] },
//     },
//   }

//   let result = await prisma.order
//     .create({
//       data: info,
//       include: {
//         items: true,
//         addresses: true,
//       },
//     })
//     .catch(async (e) => {
//       // deletes the data from first transaction if this one fails to mimic a full transaction until
//       // i figure out prisma or decide to something else
//       // main issue that i cant use on transaction beacuse order address dont actually hold the adresses.
//       throw e
//     })

//   console.log('results', result)
// }

async function main() {
  let types = [{ type: 'BOX' }, { type: 'TANK' }, { type: 'MISC' }]
  const result = await prisma.productType.createMany({
    data: types,
  })

  console.log('results', result)
}
main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
