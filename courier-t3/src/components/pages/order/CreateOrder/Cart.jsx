import React, { useEffect, useState } from 'react'
import CartItem from './CartItem'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import { useGlobalStore } from '@/components/globalStore'
import { useRouter } from 'next/router'

const Cart = () => {
  const router = useRouter()
  const setRefetchCart = useGlobalStore((state) => state.setRefetchCart)

  const { data: session, status: sessionStatus } = useSession()
  const {
    data: cartSession,
    status: cartStatus,
    refetch: refetchCart,
  } = trpc.useQuery(
    [
      'cart.getCartItems',
      { userId: session?.user?.id, customerId: router.query.customerId },
    ],
    {
      enabled: sessionStatus === 'authenticated',
    }
  )

  useEffect(() => {
    setRefetchCart(refetchCart)
  }, [refetchCart])

  const clearCart = trpc.useMutation(['cart.clearUserCartSessionItems'], {
    onSuccess: () => refetchCart(),
  })

  if (sessionStatus === 'unauthenticated' || cartStatus === 'error')
    return (
      <div>
        <h1>Current Cart</h1>
        error loading session...
      </div>
    )
  if (sessionStatus === 'loading' || cartStatus === 'loading')
    return <div>Loading Cart...</div>

  return (
    <section className="flex flex-col items-center">
      <h1>Current Cart</h1>
      <p>CartId: {cartSession?.cartId}</p>

      {cartSession?.items.map((item) => {
        return (
          <CartItem
            key={item.productId}
            {...item}
            cartId={cartSession.cartId}
            refetchCart={refetchCart}
          />
        )
      })}

      {/* <hr /> */}
      {/* <div className="cart-total"> */}
      {/*   <h4> */}
      {/*     total: <span>${totalPrice}</span> */}
      {/*   </h4> */}
      {/* </div> */}
      <button
        className="btn clear-btn"
        onClick={() => clearCart.mutate({ cartId: cartSession.cartId })}
      >
        clear cart
      </button>
    </section>
  )
}

export default Cart
