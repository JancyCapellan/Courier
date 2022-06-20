import React, { useContext, useReducer, useEffect } from 'react'
import CartReducer from './cartReducer'
import Axios from 'axios'

const CartContext = React.createContext()
export const useCart = () => {
  return useContext(CartContext)
}
const initialState = {
  loading: false,
  cart: [],
  total: 0,
  amount: 0,
  formDetails: {},
  userForCurrentOrderForm: {},
}

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, initialState)

  const addItem = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  const remove = (productsId) => {
    dispatch({ type: 'REMOVE', payload: productsId })
  }
  // const increase = (id) => {
  //   dispatch({ type: 'INCREASE', payload: id })
  // }
  // const decrease = (id) => {
  //   dispatch({ type: 'DECREASE', payload: id })
  // }
  const toggleAmount = (productsId, type) => {
    dispatch({ type: 'TOGGLE_AMOUNT', payload: { productsId, type } })
  }
  const addForm = (form) => {
    dispatch({ type: 'ADD_FORM_DETAILS', payload: form })
    // console.log('HERE')
  }
  const submitOrder = (order) => {
    // redundat, marked for deletion
    const postSubmitOrder = async (order) => {
      try {
        const res = await Axios.post('http://localhost:3000/order/submitOrder', order)
        return res
      } catch (err) {
        // console.log('here')
        console.error(err)
        alert('ERROR IN SUBMISSION')
        return 500
      }
    }
    // current error console logs in client side when returning error 500. doesnt currently alert user of error in checkout
    const res = postSubmitOrder(order)
    // console.log('resssssss', res)
    try {
      // if (res.status === undefined) return
      // console.log('res', res)
      switch (res.status) {
        case 200:
          dispatch({ type: 'SUBMIT_ORDER', payload: order })
          break

        case 204:
          alert('EMPTY ORDER')
          break

        default:
          throw new Error('status code not 200 or 204')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const bulkAdd = (productsJSON) => {
    dispatch({ type: 'BULK_ADD_ITEMS', payload: productsJSON })
  }

  const changeCurrentOrderUser = (user) => {
    dispatch({ type: 'CHANGE_ORDER_USER', payload: user })
  }
  // const fetchData = async () => {
  //   dispatch({ type: 'LOADING' })
  //   const response = await fetch(url)
  //   const cart = await response.json()
  //   dispatch({ type: 'DISPLAY_ITEMS', payload: cart })
  // }

  // useEffect(() => {
  //   fetchData()
  // }, [])

  // useEffect(() => {
  //   addItem()
  // }, [addItem])

  // useEffect(() => {
  //   console.log('form', state.formDetails)
  // }, [state.formDetails])

  useEffect(() => {
    dispatch({ type: 'GET_TOTALS' })
  }, [state.cart])

  const value = {
    ...state,
    submitOrder,
    bulkAdd,
    addItem,
    clearCart,
    remove,
    // increase,
    // decrease,
    toggleAmount,
    addForm,
    changeCurrentOrderUser,
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export { CartContext, CartProvider }
