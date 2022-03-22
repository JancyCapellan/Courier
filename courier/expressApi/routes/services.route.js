const express = require('express')
const router = express.Router()
const services = require('../controllers/services.controller')

router.get('/allProducts', services.allProducts)
// router.post('/login', user.login)

module.exports = router
