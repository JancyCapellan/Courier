import React, { useEffect, useState } from 'react'
import CartItem from './CartItem'
import {
  useCheckHydration,
  usePersistedLocallyStore,
} from '@/components/globalStore'
// import AfterStoreHyrdation from '@/components/HOC/AfterStoreHyrdation'
import shallow from 'zustand/shallow'
const Cart = () => {
  // const { cart, total, clearCart } = useCart()
  // const cart = usePersistedLocallyStore((state) => state.cartStore.cart)
  // console.log('cart: ', cart)
  // const totalPrice = usePersistedLocallyStore(
  //   (state) => state.cartStore.total_price
  // )
  // const totalItems = usePersistedLocallyStore(
  //   (state) => state.cartStore.total_items
  // )
  // const clearCart = usePersistedLocallyStore((state) => state.clearCart)

  // const isHydrated = useCheckHydration()
  const { isHydrated, cart, clearCart } = usePersistedLocallyStore(
    (state) => ({
      isHydrated: state.hasHydrated,
      cart: state.cartStore.cart,
      clearCart: state.clearCart,
    }),
    shallow
  )
  // if (!isHydrated) {
  //   return (
  //     <section>
  //       <h1>Hydration Test</h1>
  //       <p>Loading Cart...</p>
  //     </section>
  //   )
  // }

  // const [cart, setCart] = useState(cartfromStore)
  // useEffect(() => {
  //   setCart(cartfromStore)
  // }, [cart])
  // if (cart.length === 0) {
  //   return (
  //     <section className="flex flex-col items-center">
  //       {/* cart header */}
  //       <h1>Current Cart</h1>
  //       <p className="empty-cart">is currently empty</p>
  //     </section>
  //   )
  // }
  return (
    <section className="flex flex-col items-center">
      <h1>Current Cart</h1>

      {/* {!!isHydrated ? ( */}
      {/*   cart.map((item) => { */}
      {/*     // if (!isHydrated) { */}
      {/*     //   return <p>Loading CartItems...</p> */}
      {/*     // } */}
      {/*     return <CartItem key={item.productsId} {...item} /> */}
      {/*   }) */}
      {/* ) : ( */}
      {/*   <p>Loading...</p> */}
      {/* )} */}

      {/* <AfterStoreHyrdation> */}
      {/*   {cart.map((item) => { */}
      {/*     return <CartItem key={item.productsId} {...item} /> */}
      {/*   })} */}
      {/* </AfterStoreHyrdation> */}
      {cart?.map((item) => {
        return <CartItem key={item.productsId} {...item} />
      })}

      {/* <hr /> */}
      {/* <div className="cart-total"> */}
      {/*   <h4> */}
      {/*     total: <span>${totalPrice}</span> */}
      {/*   </h4> */}
      {/* </div> */}
      <button className="btn clear-btn" onClick={() => clearCart()}>
        clear cart
      </button>
    </section>
  )
}

export default Cart
