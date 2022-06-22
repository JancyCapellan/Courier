import { getAllCustomers } from '../controllers/customer.controller.mjs'
import express from 'express'
const router = express.Router()

router.get('/AllCustomers', getAllCustomers)

export default router
