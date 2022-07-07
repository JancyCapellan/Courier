import express from 'express'
const router = express.Router()
import {
  submitOrderPrisma,
  getAllOrders,
  getUserOrders,
  getUserOrderInfo,
  getAllProducts,
  getOrderInfo,
  updateOrderPickupDriverId,
  getOrderOptions,
  updateManyOrderPickupDriverId,
} from '../controllers/order.controller.mjs'

/*************
 *  ORDER CRUD
 **************/

router.post('/submitOrder', submitOrderPrisma)
router.get('/allOrders', getAllOrders)
router.get('/userOrder/:userId', getUserOrders)
router.get('/orderInfo', getUserOrderInfo)

// must be in this or allproducts routes to getOrderInfo
// router.get('/allProducts', getAllProducts)
router.get('/:orderId', getOrderInfo)
router.put('/update/:orderId', updateOrderPickupDriverId)
router.put('/update/pickupDriver/many', updateManyOrderPickupDriverId)
router.get('/options/all', getOrderOptions)

// router.get('/pickupList')

export default router
