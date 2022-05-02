const express = require('express')
const router = express.Router()
const services = require('../controllers/services.controller')

router.get('/allProducts', services.allProducts)
router.post('/addItem', services.addItem)
router.get('/productTypes', services.productTypes)

module.exports = router
