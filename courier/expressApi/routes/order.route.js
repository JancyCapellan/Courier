import express from 'express'
const router = express.Router()
import {
  submitOrderPrisma,
  getAllOrders,
  getUserOrders,
  getUserOrderInfo,
  getAllProducts,
  getOrderInfo,
  updateOrder,
} from '../controllers/order.controller.js'

/*************
 *  ORDER CRUD
 **************/

router.post('/submitOrder', submitOrderPrisma)
router.get('/allOrders', getAllOrders)
router.get('/user/:userId', getUserOrders)
router.get('/orderInfo', getUserOrderInfo)

// must be in this or allproducts routes to getOrderInfo
router.get('/allProducts', getAllProducts)
router.get('/:orderId', getOrderInfo)
router.put('/:orderId', updateOrder)

export default router
