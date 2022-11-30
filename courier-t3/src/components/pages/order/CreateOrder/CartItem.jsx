import { usePersistedLocallyStore } from '@/components/globalStore'
import { trpc } from '@/utils/trpc'
// import AfterStoreHyrdation from '@/components/HOC/AfterStoreHyrdation'
import React from 'react'
// import { useCart } from '../../contexts/cartContext'

const CartItem = ({ productId, quantity, product, cartId, refetchCart }) => {
  // const { remove, toggleAmount } = useCart()

  // const removeFromCart = usePersistedLocallyStore(
  //   (state) => state.removeFromCart
  // )
  // const toggleAmount = usePersistedLocallyStore((state) => state.toggleAmount)

  // const isHydrated = usePersistedLocallyStore((state) => state.hasHydrated)
  // if (!isHydrated) {
  //   return <p>Loading CartItem...</p>
  // }

  const removeFromCart = trpc.useMutation(['cart.removeItemFromCart'], {
    onSuccess: () => refetchCart(),
  })

  const toggleAmount = trpc.useMutation(['cart.toggleCartItemAmount'], {
    onSuccess: () => refetchCart(),
  })

  return (
    <article className="">
      {/* <img src={img} alt={title} /> */}

      <p>
        <b>{product.name}</b>
      </p>
      <div>
        {/* <h4>{title}</h4> */}
        <div className="item-price">${product.price / 100}</div>
        {/* remove button */}
        <button
          className="remove-btn"
          onClick={() =>
            removeFromCart.mutate({
              productId: productId,
              cartId: cartId,
            })
          }
        >
          remove
        </button>
      </div>
      <div>
        {/* increase amount */}
        <button
          className="amount-btn"
          onClick={() =>
            toggleAmount.mutate({
              productId: productId,
              cartId: cartId,
              toggleType: 'inc',
              currentQuantity: quantity,
            })
          }
        >
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"> */}
          {/*   <path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" /> */}
          {/* </svg> */}
          {/* ^ */}+
        </button>
        {/* amount */}
        <p className="amount">{quantity}</p>
        {/* decrease amount */}
        <button
          className="amount-btn"
          onClick={() => {
            if (quantity === 1) {
              removeFromCart.mutate({
                productId: productId,
                cartId: cartId,
              })
              return
            }

            toggleAmount.mutate({
              productId: productId,
              cartId: cartId,
              toggleType: 'dec',
              currentQuantity: quantity,
            })
          }}
        >
          {/* &#x2304; */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"> */}
          {/*   <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> */}
          {/* </svg> */}-
        </button>
      </div>
    </article>
  )
}

export default CartItem
