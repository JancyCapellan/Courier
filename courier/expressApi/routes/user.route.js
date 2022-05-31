const express = require('express')
const router = express.Router()
const user = require('../controllers/user.newcontroller.js')

/*************
 *  USER CRUD
 **************/

//register - prisma
router.post('/register', user.register)
//login - prisma
router.post('/login', user.login)
// get info after successful login - prisma
// router.get('/loggedInUser', authenticateToken, user.getloggedInUser)
// search customers for customer manager customer table
router.get('/customerSearch', user.customerSearch)
router.post('/addresses/add/:userId', user.addUserAddress)

// Update a user with userId
router.put('/:userId', user.update)
// Retrieve a single user with userId
router.get('/:userId', user.findOne)

// get all drivers by branch
router.post('/allDrivers', user.allDrivers)

// ! not in use
router.get('/getUsers', user.getUsers) //search for users dynamically with mysql locate

//bulk add items to products liust
router.post('/bulkAdd', user.addItemToProductsList)

// Retrieve all user
router.get('/all', user.findAll)

// Get user addresses with userId
router.get('/addresses/:userId', user.getAddressesWithId)

// Add user addrerss with userId
// router.post('/addresses/add/:userId', user.AddAddress)

// update address with addressId
router.put('/addresses/update/:addressId', user.updateAddress)

// get all user orders //create status for orders in mysql

// Delete a user with userId
// router.delete('/user/:userId', user.delete)

// Create a new user
// router.delete('/user', user.deleteAll)

module.exports = router

// ** example of ogranizing routes

// 'use strict'
// module.exports = function (app) {
//   var todoList = require('../controllers/todoListController')

//   // todoList Routes
//   app.route('/tasks').get(todoList.list_all_tasks).post(todoList.create_a_task)

//   app
//     .route('/tasks/:taskId')
//     .get(todoList.read_a_task)
//     .put(todoList.update_a_task)
//     .delete(todoList.delete_a_task)
// }
