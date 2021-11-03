const express = require('express')
const router = express.Router()
const order = require('../controllers/order.controller')

/*************
 *  ORDER CRUD
 **************/

router.post('/submitOrder', order.submitOrderPrisma)
router.get('/allOrders', order.getAllOrders)
router.get('/user/:userId', order.getUserOrders)
router.get('/orderInfo', order.getUserOrderInfo)

// must be in this order or allproducts routes to getOrderInfo
router.get('/allProducts', order.getAllProducts)
router.get('/:orderId', order.getOrderInfo)

module.exports = router
