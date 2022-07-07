import { debug } from 'console'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const submitOrderPrisma = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  // console.log('order', req.body)
  let order = req.body
  let cartJSON = order.cart
  let total_price = order.total_price
  let amount_items = order.amount_items

  for (let i = 0; i < cartJSON.length; i++) {
    // console.log('cart', cartJSON[i])
    delete cartJSON[i].name
    delete cartJSON[i].price
  }
  // cartJSON has shape as  {amount: 3,productsId: 1}
  console.log('new cart', cartJSON)

  // delete so the add addresses for the order have the same shape
  delete order.form.shipper.shippedFrom?.default

  let info = {
    user: {
      connect: {
        id: order.form.shipper.userId,
      },
    },
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
    status: {
      connect: {
        id: 1, //"NEW ORDER" ID
      },
    },
  }

  // missing statusm user?

  let result = await prisma.order
    .create({
      data: info,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        pickupdriver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        status: {
          select: {
            message: true,
          },
        },
      },
    })
    .catch(async (e) => {
      res.status(500).json(e)
      throw e
    })

  res.status(200).send(result)

  console.log('results', result)
}

export const getAllOrders = async (req, res) => {
  const result = await prisma.order
    .findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        pickupdriver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        status: {
          select: {
            message: true,
          },
        },
      },
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
          // console.log('datetime', result[obj][key])

          // console.log(result[obj][key].toLocaleString())
          // console.log(result[obj][key].toTimeString())
          // console.log(result[obj][key].toDateString())
          // result[obj][key] = {
          //   date: result[obj][key].toDateString(),
          //   time: result[obj][key].toTimeString(),
          // }

          result[obj][key] = result[obj][key].toLocaleString('en-US')
        }

    // console.log('allorder', result)
    res.send(result)
  }
}

export const getUserOrders = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  const id = req.params.userId

  try {
    const userOrders = await prisma.order.findMany({
      where: {
        userId: id,
      },
      include: {
        status: true,
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
        addresses: true,
      },
    })

    // if userOrders array is empty, have to check if user even exists
    if (!userOrders?.length) throw 'no orders found or user does not exists, check Id'
    if (userOrders) {
      // changing timePlaced for orders into readable local values
      // time is in 2021-11-01T16:23:29.139Z format, UTC
      for (const obj in userOrders)
        for (const key in userOrders[obj])
          if (key === 'timePlaced') {
            userOrders[obj][key] = userOrders[obj][key].toLocaleString('en-US')
          }

      // debug(userOrders)
      res.json(userOrders)
    }
  } catch (error) {
    res.status(500).json(error)
  }

  // const result = await prisma.user
  //   .findUnique({
  //     where: { id: id },
  //     include: {
  //       orders: true,
  //     },
  //   })
  //   .catch(async (e) => {
  //     res.status(500).send({ error: 'Something failed!' })
  //     throw e
  //   })
  // if (result) res.json(result)
}

export const getUserOrderInfo = async (req, res) => {
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

export const getOrderInfo = async (req, res) => {
  const id = parseInt(req.params.orderId)

  const order = await prisma.order.findUnique({
    where: {
      id: id,
    },
    include: {
      user: {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
      pickupdriver: {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
        },
      },
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
      status: {
        select: {
          message: true,
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

export const getAllProducts = async (req, res) => {
  const result = await prisma.product.findMany({})

  console.log(result)
  res.send(result)
}

export const updateOrderPickupDriverId = async (req, res) => {
  const id = parseInt(req.params.orderId)
  const driverId = req.body.driverId
  // console.log('updateorderpickupdriver by id:', id, driverId)
  const result = await prisma.order.update({
    where: {
      id: id,
    },
    data: {
      pickupdriver: {
        connect: {
          id: driverId,
        },
      },
    },
  })

  console.log(result)

  // res.json(driverId)
}

export const updateManyOrderPickupDriverId = async (req, res) => {
  //array of order ids to update,
  const ids = req.body.ids
  const driverId = req.body.driverId
  // console.log('updateorderpickupdriver by id:', id, driverId)
  const result = await prisma.order.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      pickupDriverId: driverId,
    },
  })

  console.log(result)

  res.json(result)
}

export const getOrderOptions = async (req, res) => {
  const pickupZones = await prisma.pickupZone.findMany()
  const pickupDrivers = await prisma.user.findMany({
    where: {
      role: 'DRIVER',
    },
  })

  const data = { pickupZones: pickupZones, drivers: pickupDrivers }
  res.status(200).json(data)

  // console.log('order options\n', pickupZones, pickupDrivers)
}

// ################### old #####################
// ;`${order.pickupdriver.firstName} ${order.pickupdriver.lastName}`

// ;<select onChange={(e) => updateOrderDriver(order.id, parseInt(e.target.value))}>
//   <option value={order.pickupDriverId}>
//     {order.pickupdriver.firstName} {order.pickupdriver.lastName}
//   </option>
//   <option value={3}>Driver Tester</option>
// </select>
