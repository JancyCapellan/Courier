import { usePersistedLocallyStore } from '@/components/globalStore'
import { trpc } from '@/utils/trpc'
// import AfterStoreHyrdation from '@/components/HOC/AfterStoreHyrdation'
import React from 'react'
// import { useCart } from '../../contexts/cartContext'

const CartItem = ({
  productId,
  quantity,
  product,
  cartId,
  id,
  refetchCart,
}) => {
  const removeEnitreItemFromCart = trpc.useMutation(
    ['cart.removeEnitreItemFromCart'],
    {
      onSuccess: () => refetchCart(),
    }
  )

  const removeItemFromCart = trpc.useMutation(['cart.removeItemFromCart'], {
    onSuccess: () => refetchCart(),
  })

  const addOneCartItem = trpc.useMutation(['cart.addOneCartItem'], {
    onSuccess: () => refetchCart(),
  })

  return (
    <article className="">
      <p>
        <b>{product.name}</b>
      </p>
      <div>
        <div className="item-price">${product.price / 100}</div>
        {/* remove button */}
        <button
          className="remove-btn"
          onClick={() => {
            removeEnitreItemFromCart.mutate({
              // cartItemId: id,
              cartId: cartId,
              productId: productId,
            })
          }}
        >
          remove
        </button>
      </div>
      <div>
        {/* increase amount */}
        <button
          className="amount-btn"
          onClick={() =>
            addOneCartItem.mutate({
              productId: productId,
              cartId: cartId,
            })
          }
        >
          +
        </button>
        <p className="amount">{quantity}</p>
        {/* decrease amount */}
        <button
          className="amount-btn"
          onClick={() => {
            removeItemFromCart.mutate({
              cartItemId: id,
              cartId: cartId,
            })
          }}
        >
          -
        </button>
      </div>
    </article>
  )
}

export default CartItem
