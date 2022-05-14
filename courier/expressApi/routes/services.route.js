const express = require('express')
const router = express.Router()
const services = require('../controllers/services.controller')

router.get('/allProducts', services.allProducts)
router.post('/addItem', services.addItem)
router.get('/productTypes', services.productTypes)
router.post('/addProductType', services.addProductType)
router.delete('/deleteProductType/:typeId', services.deleteProductType)

module.exports = router
