import Axios from 'axios'
import { useAuth } from './authContext'

const cartReducer = (state, action) => {
  // console.log('CART REDUCER', action)
  switch (action.type) {
    case 'ADD_ITEM':
      const updatedCart = [...state.cart]
      const updatedItemIndex = updatedCart.findIndex(
        (item) => item.productsId === action.payload.productsId
      )

      if (updatedItemIndex < 0) {
        updatedCart.push({ ...action.payload, amount: action.payload.amount })
      } else {
        const updatedItem = {
          ...updatedCart[updatedItemIndex],
        }
        updatedItem.amount = parseInt(updatedItem.amount) + parseInt(action.payload.amount)
        updatedCart[updatedItemIndex] = updatedItem
      }
      return { ...state, cart: updatedCart }

    case 'CLEAR_CART':
      return { ...state, cart: [] }

    case 'REMOVE':
      return {
        ...state,
        cart: state.cart.filter((cartItem) => cartItem.productsId !== action.payload),
      }
    // case 'INCREASE':
    //   let tempCart = state.cart.map((cartItem) => {
    //     if (cartItem.id === action.payload) {
    //       return { ...cartItem, amount: cartItem.amount + 1 }
    //     }
    //     return cartItem
    //   })
    //   return { ...state, cart: tempCart }

    // case 'DECREASE':
    //   let tempCart = state.cart
    //     .map((cartItem) => {
    //       if (cartItem.id === action.payload) {
    //         return { ...cartItem, amount: cartItem.amount - 1 }
    //       }
    //       return cartItem
    //     })
    //     .filter((cartItem) => cartItem.amount !== 0)
    //   return { ...state, cart: tempCart }

    case 'GET_TOTALS':
      let { total, amount } = state.cart.reduce(
        (cartTotal, cartItem) => {
          const { price, amount } = cartItem
          const itemTotal = price * amount

          cartTotal.total += itemTotal
          cartTotal.amount += amount
          return cartTotal
        },
        {
          total: 0,
          amount: 0,
        }
      )
      total = parseFloat(total.toFixed(2))

      return { ...state, total, amount }

    case 'LOADING':
      return { ...state, loading: true }

    case 'DISPLAY_ITEMS':
      return { ...state, cart: action.payload, loading: false }

    case 'TOGGLE_AMOUNT':
      let tempCart = state.cart
        .map((cartItem) => {
          if (cartItem.productsId === action.payload.productsId) {
            if (action.payload.type === 'inc') {
              return { ...cartItem, amount: cartItem.amount + 1 }
            }
            if (action.payload.type === 'dec') {
              return { ...cartItem, amount: cartItem.amount - 1 }
            }
          }
          return cartItem
        })
        .filter((cartItem) => cartItem.amount !== 0)
      return { ...state, cart: tempCart }

    case 'ADD_FORM_DETAILS':
      return { ...state, formDetails: action.payload }

    case 'SUBMIT_ORDER':
      Axios.post('http://localhost:5000/user/submitOrder', action.payload)
        .then((res) => {
          console.log('res:', res)

          if (res.status === 200) {
            console.log('completed')
          }
        })
        .catch((error) => {
          console.log('Registration Error', error)
          // alert('Error')
        })

      return state

    case 'BULK_ADD_ITEMS':
      let itemArray = []
      let itemListJSON = action.payload
      // console.log(state, order)

      itemListJSON.map((item) => itemArray.push([item.id, item.name, item.price, item.type]))
      console.log('cartArray', itemArray)

      Axios.post('http://localhost:5000/user/bulkAdd', itemArray)
        .then((res) => {
          console.log('res:', res)

          if (res.status === 200) {
            console.log('completed')
          }
        })
        .catch((error) => {
          console.log('Bulk Items', error)
          // alert('Error')
        })

      return state

    case 'CHANGE_ORDER_USER':
      const user = action.payload
      console.log('CHANGE USER FOR NEW ORDER', user)
      return { ...state, currentOrderUser: user }

    default:
      throw new Error('no matching action type')
  }
}

export default cartReducer
