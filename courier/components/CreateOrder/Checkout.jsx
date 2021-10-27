import React, { useState, useEffect } from 'react'
import { useCart } from '../../contexts/cartContext'
import Cart from './Cart'
import axios from 'axios'
// import { useHistory } from 'react-router'

const Checkout = () => {
  const [cashToggle, setCashToggle] = useState(true)
  const [addressStrings, setAddressStrings] = useState({ shipper: '', reciever: '' })
  const { cart, total, amount, formDetails, submitOrder } = useCart()
  // const history = useHistory()

  // order is the body that is sent to api
  const order = {
    cart: cart,
    total_price: total,
    amount_items: amount,
    form: formDetails,
    // parsedAddresses: addressStrings,
    id: formDetails.shipper.id,
  }

  async function postOrder(order) {
    await axios
      .post('http://localhost:3000/user/submitOrder', order)
      .then((res) => {
        console.log('res:', res)

        if (res.status === 200) {
          console.log('completed order submission')
          alert('completed')
        }
      })
      .catch((error) => {
        console.log('Registration Error', error)
        // alert('Error')
      })
  }

  //make sure to clean up order/cart
  const submit = () => {
    console.log('order', order)
    postOrder(order)

    // go to review order page with reciept of order
    // history.push('/customers')
    // try {
    //   // console.log(order.form)
    //   await submitOrder(order)
    //   alert('ORDER COMPLETED')
    // } catch (error) {
    //   console.log('failed to submit order')
    // }
  }

  function handleChange(e) {
    const target = e.target
    const value = target.value
    if (value === 'card') setCashToggle(false)
    if (value === 'cash') setCashToggle(true)
  }

  function CreditCardForm() {
    return (
      <div>
        <p>Name on card</p>
        <p>card number</p>
        <p> expiry date</p>
        <p>security code</p>
        <p>zip/postal code</p>
      </div>
    )
  }

  function createAddressStringFromForm() {
    let addressStrings = { shipper: '', reciever: '' }
    for (const obj in formDetails)
      for (const key in formDetails[obj]) {
        // console.log(obj, key, formDetails[obj][key])
        if (obj === 'shipper')
          addressStrings.shipper = addressStrings.shipper + ` ${formDetails[obj][key]}`
        if (obj === 'reciever')
          addressStrings.reciever = addressStrings.reciever + ` ${formDetails[obj][key]}`
      }
    setAddressStrings(addressStrings)

    // console.log(addressStrings.shipper, 'tt', addressStrings.reciever)
  }

  useEffect(() => {
    createAddressStringFromForm()
  }, [])

  return (
    <section className='checkout-section'>
      <section>
        <h1>shipping information</h1>
        <p>shipper: {addressStrings.shipper} </p>
        <p>reciever: {addressStrings.reciever} </p>
      </section>
      <Cart />
      <h1>payment form</h1>
      <input type='radio' name='cardOrCheck' onChange={handleChange} value='cash' defaultChecked />
      <label>
        <p>Cash/Check</p>
      </label>

      <input type='radio' name='cardOrCheck' onChange={handleChange} value='card' />
      <label>
        <p>Card</p>
      </label>
      {cashToggle ? <p>cash selected</p> : <CreditCardForm />}

      <button onClick={() => submit()}>CHECKOUT</button>
    </section>
  )
}

export default Checkout