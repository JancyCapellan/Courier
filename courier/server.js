//3rd party modules
const express = require('express')
// const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const next = require('next')

//custom modules
// const indexRouter = require('./routes/index.route')
const userRouter = require('./expressApi/routes/user.route')
const orderRouter = require('./expressApi/routes/order.route')
const servicesRouter = require('./expressApi/routes/services.route')
//server start

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const server = express()
app
  .prepare()
  .then(() => {
    server.use(logger('dev'))
    server.use(express.json())
    server.use(express.urlencoded({ extended: false }))
    // server.use(cookieParser())
    server.use(cors())

    // server routes
    // server.use('/', indexRouter)
    server.use('/user', userRouter)
    server.use('/order', orderRouter)
    server.use('/services', servicesRouter)

    // not sure if changing to all from get caused any bugs, but the offical example had it as such
    server.all('*', (req, res) => {
      return handle(req, res)
    })
    server.post('/api/auth/*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, () => {
      console.log('server is listening on port 3000...')
    })
  })
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })

module.exports = server
