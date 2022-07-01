import {
  register,
  login,
  customerSearch,
  addUserAddress,
  updateUserInformation,
  findOne,
  allDrivers,
  getUserAddressesWithUserId,
  updateUserAddress,
} from '../controllers/user.newcontroller.mjs'

// import { Router } from 'express'
import express from 'express'
const router = express.Router()

/*************
 *  USER CRUD
 **************/

//register - prisma
router.post('/register', register)
//login - prisma
router.post('/login', login)
// get info after successful login - prisma
// router.get('/loggedInUser', authenticateToken, user.getloggedInUser)
router.get('/customerSearch', customerSearch)
router.post('/addresses/add/:userId', addUserAddress)
router.put('/addresses/update/:addressId', updateUserAddress)

// Update a user with userId
router.put('/:userId', updateUserInformation)
// Retrieve a single user with userId
router.get('/:userId', findOne)

// get all drivers by branch
router.post('/allDrivers', allDrivers)

router.get('/addresses/:userId', getUserAddressesWithUserId)
// router.put('/addresses/update/:addressId', updateAddress)

// ! not in use
// router.get('/getUsers', getUsers)

//bulk add items to products liust
// router.post('/bulkAdd', addItemToProductsList)

// Retrieve all user
// router.get('/all', findAll)

// Get user addresses with userId

// Add user addrerss with userId
// router.post('/addresses/add/:userId', user.AddAddress)

// update address with addressId

// get all user orders //create status for orders in mysql

// Delete a user with userId
// router.delete('/user/:userId', user.delete)

// Create a new user
// router.delete('/user', user.deleteAll)

export default router
