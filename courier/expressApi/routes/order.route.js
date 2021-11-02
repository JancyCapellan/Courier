const express = require('express')
const router = express.Router()
const order = require('../controllers/user.newcontroller.js')

/*************
 *  ORDER CRUD
 **************/

router.post('/submitOrder', order.submitOrderPrisma)
router.get('/allOrders', order.getAllOrders)
router.get('/:userId', order.getUserOrders)
router.get('/orderInfo', order.getUserOrderInfo)

module.exports = router
