import express from 'express'
import {
  getAllContainerDetails,
  getAllWarehousedetails,
} from '../controllers/warehouse.controller.mjs'

const router = express.Router()

router.get('/allWarehouseDetails', getAllWarehousedetails)
router.get('/allContainerDetails', getAllContainerDetails)

export default router
