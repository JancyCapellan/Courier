import {
  register,
  login,
  customerSearch,
  addUserAddress,
  updateUserInformation,
  getUserAccountInfo,
  getAllStaff,
  getUserAddressesWithUserId,
  updateUserAddress,
  getUniqueStaff,
} from '../controllers/user.newcontroller.mjs'

// import { Router } from 'express'
import express from 'express'
const router = express.Router()

/*************
 *  USER CRUD
 **************/
router.get('/:userId', getUserAccountInfo)
router.put('/:userId', updateUserInformation)
router.post('/register', register)
router.post('/login', login)
router.get('/customerSearch', customerSearch)
router.get('/addresses/:userId', getUserAddressesWithUserId)
router.post('/addresses/add/:userId', addUserAddress)
router.put('/addresses/update/:addressId', updateUserAddress)
router.get('/users/getAllStaff', getAllStaff)
router.get('/users/getUniqueStaff/:staffId', getUniqueStaff)

export default router
