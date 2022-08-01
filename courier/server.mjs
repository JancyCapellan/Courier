//3rd party modules
import express from 'express'
// const cookieParser = require('cookie-parser')
import logger from 'morgan'
import cors from 'cors'
import next from 'next'

//custom modules
// const indexRouter = require('./routes/index.route')
import userRouter from './backend/routes/user.route.mjs'
import orderRouter from './backend/routes/order.route.mjs'
import servicesRouter from './backend/routes/services.route.mjs'
import customerRouter from './backend/routes/customer.route.mjs'
import warehouseRouter from './backend/routes/warehouse.route.mjs'
//server start

// let corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200,
// }
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.port || 3000
const app = next({ dev })
const handle = app.getRequestHandler()
const server = express()
app
  .prepare()
  .then(() => {
    server.use(logger('dev'))
    server.use(express.json())
    server.use(express.urlencoded({ extended: true })) // makes nested objects possible in the url
    // server.use(cookieParser())
    server.use(cors())

    // server routes
    // server.use('/', indexRouter)
    server.use('/user', userRouter)
    server.use('/order', orderRouter)
    server.use('/services', servicesRouter)
    server.use('/customer', customerRouter)
    server.use('/warehouse', warehouseRouter)

    // not sure if changing to all from get caused any bugs, but the offical example had it as such
    server.all('*', (req, res) => {
      return handle(req, res)
    })
    server.post('/api/auth/*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, () => {
      console.log(`server is listening on port ${port}...`)
    })
  })
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })

export default server
