const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here

  // const allUsers = await prisma.user.findMany()
  // console.log(allUsers)

  // const result = await prisma.user.create({
  //   data: {
  //     ...req.body,
  //   },
  // })

  // const result = await prisma.user.findFirst({
  //   where: {
  //     email: 'jancycapellan97@gmail.com',
  //     password: '123',
  //   },
  //   select: {
  //     id: true,
  //     firstName: true,
  //     lastName: true,
  //     role: true,
  //     preferredLanguage: true,
  //     email: false,
  //   },
  // })

  // const result = await prisma.user.findFirst({
  //   where: {
  //     AND: [
  //       {
  //         email: 'fish',
  //       },
  //       {
  //         password: '123',
  //       },
  //     ],
  //   },
  // })
  // console.log(result)

  // const updateUser = await prisma.user.update({
  //   where: {
  //     email: 'jessyjones@email.com',
  //   },
  //   data: {
  //     role: 'SECT',
  //   },
  // })

  // console.log('updated user', updateUser)

  let search = 'jancy'
  // const result = await prisma.user.findMany({
  //   where: {
  //     OR: [
  //       {
  //         email: {
  //           contains: search,
  //         },
  //       },
  //       {
  //         firstName: {
  //           contains: search,
  //         },
  //       },
  //       {
  //         lastName: {
  //           contains: search,
  //         },
  //       },
  //       // {
  //       //   id: {
  //       //     contains: {},
  //       //   },
  //       // },
  //     ],
  //   },
  // })
  // console.log(result)
  // const result = await prisma.user.findMany({})

  const order = {
    cart: [
      {
        name: 'Prod. Niños',
        amount: 1,
        productsId: '0762',
        price: 75,
      },
      {
        name: 'Tanq. Misc',
        amount: 1,
        productsId: '0704',
        price: 75,
      },
      {
        name: 'Tanq Ropa/Zap',
        amount: 1,
        productsId: '0701',
        price: 75,
      },
      {
        name: 'Mesas',
        amount: 1,
        productsId: '0724',
        price: 75,
      },
    ],
    total_price: 300,
    amount_items: 4,
    form: {
      shipper: {
        userId: 1,
        FirstName: 'Jancy',
        LastName: 'Capellan',
        Address: '314 East 100st apt 6f',
        Address2: '',
        Address3: '',
        City: 'New York City',
        State: 'NY',
        PostalCode: '10029',
        Country: '',
        Cellphone: '3475209701',
        Telephone: '',
      },
      reciever: {
        userId: 1,
        FirstName: 'Jessica',
        LastName: 'jones',
        Address: '471 main ST apt 23',
        Address2: 'e',
        Address3: 'e',
        City: 'NYC',
        State: 'NY',
        PostalCode: '14379',
        Country: 'DR',
        Cellphone: '1345219999',
        Telephone: '',
        recipient: true,
      },
    },
    userId: 1,
  }

  let info = {
    userId: order.userId,
    recieverFirstName: order.form.reciever.FirstName,
    recieverLastName: order.form.reciever.LastName,
    totalItems: order.amount_items,
    totalPrice: order.total_price,
    items: {
      createMany: [
        {
          name: 'Prod. Niños',
          amount: 1,
          productsId: '0762',
          price: 75,
        },
        {
          name: 'Tanq. Misc',
          amount: 1,
          productsId: '0704',
          price: 75,
        },
        {
          name: 'Tanq Ropa/Zap',
          amount: 1,
          productsId: '0701',
          price: 75,
        },
        {
          name: 'Mesas',
          amount: 1,
          productsId: '0724',
          price: 75,
        },
      ],
    },
    addresses: {
      shippedFrom: {
        connectOrCreate: {
          shipperAddress: order.form.shipper,
        },
      },
      shippedTo: {
        connectOrCreate: {
          recieverAddress: order.form.reciever,
        },
      },
    },
  }

  // const addresses = await prisma.address.createMany({
  //   data: [
  //     { ...order.form.shipper },
  //     { order.userId, ...order.form.reciever },
  //   ],
  // })
  // const result = await prisma.order.create({
  //   data: info,
  // })

  // const result = await prisma.product.createMany({
  //   data: [
  //     {
  //       name: 'Aceite',
  //       id: 734,
  //       price: 30,
  //       type: 1,
  //     },
  //     {
  //       name: 'Aire',
  //       id: 741,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Arroz',
  //       id: 735,
  //       price: 30,
  //       type: 2,
  //     },
  //   ],
  // })

  const result = await prisma.product.update({
    where: {
      id: 735,
    },
    data: {
      type: 3,
    },
  })

  // const result = await prisma.product.createMany({
  //   data: [
  // {
  //   name: 'Aceite',
  //   id: 734,
  //   price: 30,
  //   type: 3,
  // },
  // {
  //   name: 'Aire',
  //   id: 741,
  //   price: 30,
  //   type: 3,
  // },
  // {
  //   name: 'Arroz',
  //   id: 735,
  //   price: 30,
  //   type: 3,
  // },
  //     {
  //       name: 'Bicicleta',
  //       id: 733,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Caja Comida',
  //       id: 705,
  //       price: 30,
  //       type: 1,
  //     },
  //     {
  //       name: 'Caja Ropa / Zap',
  //       id: 707,
  //       price: 30,
  //       type: 1,
  //     },
  //     {
  //       name: 'Caja Misc',
  //       id: 708,
  //       price: 30,
  //       type: 1,
  //     },
  //     {
  //       name: 'Colchon',
  //       id: 719,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Computdora',
  //       id: 715,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Electrónica Misc',
  //       id: 737,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Espardar',
  //       id: 726,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Estante',
  //       id: 729,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Estufa',
  //       id: 714,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Espejo',
  //       id: 731,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Gabetero',
  //       id: 727,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Gomas',
  //       id: 732,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Lampara',
  //       id: 730,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Lavadora',
  //       id: 711,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Microonda',
  //       id: 713,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Mesas',
  //       id: 724,
  //       price: 30,
  //       type: 4,
  //     },
  //     {
  //       name: 'Nevera',
  //       id: 712,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Parte de Carros',
  //       id: 716,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Planta Electrica',
  //       id: 718,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Sillas',
  //       id: 725,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Secadora',
  //       id: 742,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Tanq Comida',
  //       id: 702,
  //       price: 30,
  //       type: 2,
  //     },
  //     {
  //       name: 'Tanq Hierro',
  //       id: 703,
  //       price: 30,
  //       type: 2,
  //     },
  //     {
  //       name: 'Tanq Ropa/Zap',
  //       id: 701,
  //       price: 30,
  //       type: 2,
  //     },
  //     {
  //       name: 'Tanq. Misc',
  //       id: 704,
  //       price: 30,
  //       type: 2,
  //     },
  //     {
  //       name: 'TV',
  //       id: 709,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Viuro',
  //       id: 728,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Mueble Misc',
  //       id: 738,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Cristal Misc',
  //       id: 739,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Hierro Misc',
  //       id: 740,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Prod. Caseros',
  //       id: 743,
  //       price: 30,
  //       type: 3,
  //     },
  //     {
  //       name: 'Prod. Niños',
  //       id: 762,
  //       price: 30,
  //       type: 3,
  //     },
  //   ],
  // })

  console.log('results', result)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
