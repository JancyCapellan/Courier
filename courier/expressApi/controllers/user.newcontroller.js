const User = require('../models/user.model.js')
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()

let refreshTokens = []

// register new user
exports.register = async (req, res) => {
  console.log('register')
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  const result = await prisma.user.create({
    data: {
      ...req.body,
    },
  })
  res.json(result)
}

// Login in user to correct site
exports.login = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  const result = await prisma.user.findFirst({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
    select: {
      id: true,
      preferredLanguage: true,
    },
  })

  console.log('login results', result)
  if (result !== null) {
    console.log('testtt')
    const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign(result, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  }
  if (result === null) {
    console.log('elsewhere')
    res.status(500).send({ error: 'Something failed!' })
  }
}

// get user info after login
exports.getloggedInUser = async (req, res) => {
  let user = req.user
  console.log('user', user)

  if (!req.body || !user) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  const result = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  })
  if (result) res.send(result)
}

// Update a user identified by the userId in the request
exports.update = async (req, res) => {
  const user = await prisma.user.update({
    where: { id: req.body.id },
    data: req.body,
  })
  console.log(user)

  if (user) {
    res.send(user).status(200)
  }
}

exports.customerSearch = async (req, res) => {
  console.log('search', req.query)
  // const search = toString(req.query.search)
  const search = req.query.search
  let result
  if (search === '') {
    console.log('here')
    result = await prisma.user.findMany({
      // should be role: "cust" to oonly show customers. blank to show all users for dev purposes
      // where: {
      //   role: 'admin',
      // },
    })
    console.log('results', result)
    res.send(result)
  } else {
    console.log('here2')
    result = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: {
              contains: search,
            },
          },
          {
            firstName: {
              contains: search,
            },
          },
          {
            lastName: {
              contains: search,
            },
          },
        ],
        // AND: [
        //   {
        //     role: {
        //       contains: 'CUST',
        //     },
        //   },
        // ],
      },
    })
    res.send(result)
  }
}

exports.submitOrderPrisma = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }
  console.log('order', req.body)
  let order = req.body
  let cartJSON = order.cart
  let customerId = order.id
  let addresses = order.form
  let total_price = order.total_price
  let amount_items = order.amount_items

  async function main() {
    // ... you will write your Prisma Client queries here

    const order = {
      cart: [
        {
          name: 'Prod. Niños',
          quantity: 1,
          productsId: '0762',
          price: 75,
        },
        {
          name: 'Tanq. Misc',
          quantity: 1,
          productsId: '0704',
          price: 75,
        },
        {
          name: 'Tanq Ropa/Zap',
          quantity: 1,
          productsId: '0701',
          price: 75,
        },
        {
          name: 'Mesas',
          quantity: 1,
          productsId: '0724',
          price: 75,
        },
      ],
      total_price: 300,
      quantity_items: 4,
      form: {
        shipper: {
          userId: 1,
          firstName: 'Jancy',
          lastName: 'Capellan',
          shippedFrom: {
            address: '314 East 100st apt 6f',
            address2: '',
            address3: '',
            city: 'New York City',
            state: 'NY',
            postalCode: 10029,
            country: '',
            cellphone: '3475209701',
            telephone: null,
            default: false,
          },
        },
        reciever: {
          firstName: 'Jessica',
          lastName: 'jones',
          shippedTo: {
            address: '471 Santiago rd',
            address2: '',
            address3: '',
            city: 'santiago',
            state: 'DR',
            postalCode: 14379,
            country: 'DR',
            cellphone: '1345219999',
            telephone: null,
            recipient: true,
          },
        },
      },
      paymentType: order.payment,
    }

    let info = {
      userId: order.form.shipper.userId,
      recieverFirstName: order.form.reciever.firstName,
      recieverLastName: order.form.reciever.lastName,
      totalItems: 14, //order.quantity_items,
      totalPrice: 14 * 75, //order.total_price,
      items: {
        createMany: {
          data: [
            {
              quantity: 1,
              productsId: 762,
            },
            {
              quantity: 13,
              productsId: 704,
            },
          ],
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
        throw e
      })

    console.log('results', result)
  }
}

//submits orders for payment into database
exports.submitOrder = (req, res) => {
  console.log('order', req.body)
  let order = req.body
  let cartJSON = order.cart
  let customerId = order.id
  let addresses = order.form
  let total_price = order.total_price
  let amount_items = order.amount_items

  //  customer address_Id  need to check if a preselected address was submitted
  // to avoid
  let address_id = addresses.shipper.address_id

  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }

  User.submitOrder2(
    customerId,
    cartJSON,
    addresses,
    total_price,
    amount_items,
    (err, data) => {
      if (err) {
        //possible error here when sending err
        res.status(500).send({
          message: err.message || 'Some error occurred while submitting order.',
        })
      }
      console.log('past query')
      res.status(200).send(data)
    }
  )
}

exports.addItemToProductsList = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: 'Content can not be empty!',
    })
  }

  const productList = req.body
  console.log(list)
  User.addItemToProductList(productList, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while bulk adding items.',
      })
    } else res.status(200).send(data)
  })
}

exports.getUsers = (req, res) => {
  // console.log(req)
  User.getAllWithSearch(req.query.search, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`,
        })
      } else {
        res.status(500).send({
          message: 'Error retrieving Customer with id ' + req.params.customerId,
        })
      }
    } else res.status(200).send(data)
  })
}

// Retrieve all users from the database.
exports.findAll = (req, res) => {
  User.findAll((err, data) => {
    console.log('data', data)
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.',
      })
    else res.send(data)
  })
}

// Find a single user with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`,
        })
      } else {
        res.status(500).send({
          message: 'Error retrieving Customer with id ' + req.params.customerId,
        })
      }
    } else res.send(data)
  })
}

exports.findByName = (req, res) => {
  User.findByName(req.params, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`,
        })
      } else {
        res.status(500).send({
          message: 'Error retrieving Customer with id ' + req.params.customerId,
        })
      }
    } else res.send(data)
  })
}

exports.getAddressesWithId = (req, res) => {
  const id = req.params.userId
  User.getAddresses(id, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Customer with id ${id}.`,
        })
      } else {
        res.status(500).send({
          message: 'Error retrieving Customer with id ' + id,
        })
      }
    } else res.send(data)
  })
}

exports.AddAddress = (req, res) => {
  const id = req.params.userId
  const form = req.body
  let address = [
    form.users_id,
    form.address,
    form.address2,
    form.address3,
    form.city,
    form.state,
    form.postal_code,
    form.country,
    form.cellphone,
    form.telephone,
  ]

  User.addAddress(address, (err, data) => {
    if (err) {
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Not found Customer with id ${id}.`,
        })
      } else {
        res.status(500).send({
          message: 'Error retrieving Customer with id ' + id,
        })
      }
    } else res.send(data)
  })
}

exports.updateAddress = (req, res) => {
  let address = req.body
  let addressId = req.params.addressId
  console.log('HERE##')
  User.updateAddress(addressId, address, (err, data) => {
    if (err) {
      console.log('ERROR', err)
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: `Cannot find address with id ${addressId}.`,
        })
      } else {
        res.status(500).send({
          message: 'Error updating address with id ' + addressId,
        })
      }
    } else res.send(data)
  })
}

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {}

// Delete all users from the database.
exports.deleteAll = (req, res) => {}

exports.getAllOrders = (req, res) => {
  User.getAllOrders((err, data) => {
    if (err) {
      console.log('ERROR', err)
      if (err.kind === 'not_found') {
        res.status(404).send({
          message: '',
        })
      } else {
        res.status(500).send({
          message: '',
        })
      }
    } else {
      console.log('ORDERS', data)
      res.send(data)
    }
  })
}
