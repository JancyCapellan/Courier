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

  if (result) {
    const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign(result, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
    // res.send(result).status(200)
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
          {
            role: {
              contains: 'CUST',
            },
          },
        ],
      },
    })
    res.send(result)
  }
}
