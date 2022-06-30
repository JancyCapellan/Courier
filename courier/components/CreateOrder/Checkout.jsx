import React, { useState, useEffect } from 'react'
import { useCart } from '../../contexts/cartContext'
import Cart from './Cart'
import axios from 'axios'
// import { useHistory } from 'react-router'
// import QRCode from 'qrcode.react'

const Checkout = () => {
  const [cashToggle, setCashToggle] = useState(true)
  // const [addressStrings, setAddressStrings] = useState({ shipper: '', reciever: '' })
  const { cart, total, amount, formDetails, submitOrder } = useCart()
  // const history = useHistory()

  let paymentType = !!cashToggle ? 'CASH' : 'CREDIT'
  // order is the body that is sent to api
  const order = {
    cart: cart,
    total_price: total,
    amount_items: amount,
    form: formDetails,
    paymentType: paymentType,
  }

  async function postOrder(order) {
    await axios
      .post('http://localhost:3000/order/submitOrder', order)
      .then((res) => {
        console.log('res:', res)

        if (res.status === 200) {
          console.log('completed order submission')
          alert('completed')
        }
      })
      .catch((error) => {
        alert('Order Error', error)
        // alert('Error')
      })
  }

  const submit = () => {
    console.log('order', order)
    postOrder(order)
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

  return (
    <section className='checkout-section'>
      {/* <section>
        <h1>shipping information</h1>
        <p>shipper: {formDetails.shipper.First} </p>
        <p>reciever: {addressStrings.reciever} </p>
      </section> */}
      <Cart />
      {/* ! format order into nice string for better QRcode reads */}
      {/* <QRCode value={JSON.stringify({ cart, total, addressStrings })} size={200} /> */}
      <section>
        <h1>payment form</h1>
        <input
          type='radio'
          name='cardOrCheck'
          onChange={handleChange}
          value='cash'
          defaultChecked
        />
        <label>
          <p>Cash/Check</p>
        </label>

        <input type='radio' name='cardOrCheck' onChange={handleChange} value='card' />
        <label>
          <p>Card</p>
        </label>
        {cashToggle ? <p>cash selected</p> : <CreditCardForm />}
      </section>
      <button onClick={() => submit()}>CHECKOUT</button>
    </section>
  )
}

export default Checkout
