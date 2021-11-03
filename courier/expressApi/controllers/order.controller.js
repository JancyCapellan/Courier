const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.submitOrderPrisma = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  console.log('order', req.body)
  let order = req.body
  let cartJSON = order.cart
  let total_price = order.total_price
  let amount_items = order.amount_items

  for (let i = 0; i < cartJSON.length; i++) {
    console.log('cart', cartJSON[i])
    delete cartJSON[i].name
    delete cartJSON[i].price
  }
  console.log('new cart', cartJSON)

  let info = {
    userId: order.form.shipper.userId,
    // user: { connect: order.form.shipper.userId },
    recieverFirstName: order.form.reciever.firstName,
    recieverLastName: order.form.reciever.lastName,
    totalItems: amount_items,
    totalPrice: total_price,
    paymentType: order.paymentType,
    items: {
      createMany: {
        data: cartJSON,
      },
    },
    addresses: {
      createMany: { data: [order.form.shipper.shippedFrom, order.form.reciever.shippedTo] },
    },
  }

  let result = await prisma.order
    .create({
      data: info,
      include: {
        items: true,
        addresses: true,
      },
    })
    .catch(async (e) => {
      res.status(500).send({ error: 'Something failed!' })
      throw e
    })

  res.status(200).send(result)

  console.log('results', result)
}

exports.getAllOrders = async (req, res) => {
  const result = await prisma.order
    .findMany({
      // select: {
      //   timePlaced: true,
      // },
    })
    .catch(async (e) => {
      res.status(500).send({ error: 'Something failed!' })
      throw e
    })
  if (result) {
    // changing timePlaced for orders into readable local values
    // time is in 2021-11-01T16:23:29.139Z format, UTC
    //might make it so i can get both date and time seperatly in response
    for (const obj in result)
      for (const key in result[obj])
        if (key === 'timePlaced') {
          console.log('datetime', result[obj][key])

          console.log(result[obj][key].toLocaleString())
          console.log(result[obj][key].toTimeString())
          console.log(result[obj][key].toDateString())
          // result[obj][key] = {
          //   date: result[obj][key].toDateString(),
          //   time: result[obj][key].toTimeString(),
          // }

          result[obj][key] = result[obj][key].toLocaleString()
        }

    console.log(result)
    res.send(result)
  }
}

exports.getUserOrders = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  const id = parseInt(req.params.userId)
  const result = await prisma.user
    .findUnique({
      where: { id: id },
      include: {
        orders: true,
      },
    })
    .catch(async (e) => {
      res.status(500).send({ error: 'Something failed!' })
      throw e
    })
  if (result) res.send(result)
}

exports.getUserOrderInfo = async (req, res) => {
  const id = parseInt(req.params.userId)
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  const result = await prisma.order
    .findUnique({
      where: { id: id },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                productType: {
                  select: {
                    type: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    .catch(async (e) => {
      res.status(500).send({ error: 'Something failed!' })
      throw e
    })
  if (result) res.send(result)
}

exports.getOrderInfo = async (req, res) => {
  const id = parseInt(req.params.orderId)

  const order = await prisma.order.findUnique({
    where: {
      id: id,
    },
    include: {
      addresses: true,
      items: {
        include: {
          product: {
            select: {
              price: true,
              name: true,
              productType: {
                select: {
                  type: true,
                },
              },
            },
          },
        },
      },
    },
  })
  if (order) {
    // changing timePlaced for orders into readable local values
    for (const key in order)
      if (key === 'timePlaced') {
        order[key] = order[key].toLocaleString()
      }

    console.log(order)
    res.send(order)
  }
  // console.log(order)
}

exports.getAllProducts = async (req, res) => {
  const result = await prisma.product.findMany({})

  console.log(result)
  res.send(result)
}

exports.updateOrder = async (req, res) => {
  const id = parseInt(req.params.orderId)
  const data = req.body
  const result = await prisma.order.update({
    where: {
      id: id,
    },
    data: data,
  })

  console.log(result)
}

// ################### old #####################
