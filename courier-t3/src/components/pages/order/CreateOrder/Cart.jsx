import React from 'react'
import CartItem from './CartItem'
import { useGlobalStore } from '@/components/globalStore'

const Cart = ({ handlePage }) => {
  // const { cart, total, clearCart } = useCart()
  const cart = useGlobalStore((state) => state.cartContent)
  const totalPrice = useGlobalStore((state) => state.totalPrice)
  const totalqty = useGlobalStore((state) => state.totalqty)
  const clearCart = useGlobalStore((state) => state.clearCart)

  if (cart.length === 0) {
    return (
      <section className='cart'>
        {/* cart header */}
        <header>
          <h2>Cart</h2>
          <h4 className='empty-cart'>is currently empty</h4>
        </header>
      </section>
    )
  }
  return (
    <section className='cart'>
      {/* cart header */}
      <header>
        <h2>your bag</h2>
      </header>
      {/* cart items */}
      <div>
        {cart.map((item) => {
          return <CartItem key={item.productsId} {...item} />
        })}
      </div>
      {/* {console.log('cart', cart)} */}
      {/* cart footer */}
      <footer>
        <hr />
        <div className='cart-total'>
          <h4>
            total <span>${totalPrice}</span>
          </h4>
        </div>
        <button className='btn clear-btn' onClick={() => clearCart()}>
          clear cart
        </button>
      </footer>
      {handlePage ? (
        <button onClick={() => handlePage('NEXT')}>CONTINE TO CHECKOUT</button>
      ) : (
        ''
      )}
    </section>
  )
}

export default Cart
