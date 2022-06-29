import { getAllCustomers, addManyCustomers, getHello } from '../controllers/customer.controller.mjs'
import express from 'express'
const router = express.Router()

router.get('/AllCustomers', getAllCustomers)
router.post('/addManyCustomers', addManyCustomers)
router.get('/getHello', getHello)

export default router
