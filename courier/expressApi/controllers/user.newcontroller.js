const User = require('../models/user.model.js')
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const { DateTime } = require('luxon')
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

exports.allDrivers = async (req, res) => {
  const branch = req.body.branch
  const drivers = await prisma.user.findMany({
    where: {
      AND: [{ role: 'DRIVE' }, { branchName: branch }],
    },
  })

  res.send(drivers)
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

// ####################    OLD  ###########################

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
exports.findOne = async (req, res) => {
  const id = parseInt(req.params.userId)
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })
  console.log('unique user', user)
  res.send(user)
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

// exports.delete = (req, res) => {}

// Delete all users from the database.
// exports.deleteAll = (req, res) => {}

// exports.getAllOrders = (req, res) => {
//   User.getAllOrders((err, data) => {
//     if (err) {
//       console.log('ERROR', err)
//       if (err.kind === 'not_found') {
//         res.status(404).send({
//           message: '',
//         })
//       } else {
//         res.status(500).send({
//           message: '',
//         })
//       }
//     } else {
//       console.log('ORDERS', data)
//       res.send(data)
//     }
//   })
// }
