import express from 'express'
const router = express.Router()
import {
  allProducts,
  addItem,
  productTypes,
  addProductType,
  deleteProductType,
} from '../controllers/services.controller.mjs'

router.get('/allProducts', allProducts)
router.post('/addItem', addItem)
router.get('/productTypes', productTypes)
router.post('/addProductType', addProductType)
router.delete('/deleteProductType/:typeId', deleteProductType)

export default router
