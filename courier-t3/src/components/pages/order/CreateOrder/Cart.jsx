import React, { useEffect, useState } from 'react'
import CartItem from './CartItem'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import { useGlobalStore } from '@/components/globalStore'

const Cart = () => {
  const setRefetchCart = useGlobalStore((state) => state.setRefetchCart)

  const { data: session, status: sessionStatus } = useSession()
  const {
    data: cartSession,
    status: cartStatus,
    refetch: refetchCart,
  } = trpc.useQuery(['cart.getCartSession', { userId: session?.user?.id }])

  useEffect(() => {
    setRefetchCart(refetchCart)
  }, [refetchCart])

  const clearCart = trpc.useMutation(['cart.clearUserCartSession'], {
    onSuccess: () => refetchCart(),
  })

  if (sessionStatus === 'unauthenticated')
    return <div>error loading session...</div>
  if (sessionStatus === 'loading' || cartStatus === 'loading')
    return <div>Loading Cart...</div>

  return (
    <section className="flex flex-col items-center">
      <h1>Current Cart</h1>

      {cartSession?.items.map((item) => {
        return <CartItem key={item.productId} {...item} />
      })}

      {/* <hr /> */}
      {/* <div className="cart-total"> */}
      {/*   <h4> */}
      {/*     total: <span>${totalPrice}</span> */}
      {/*   </h4> */}
      {/* </div> */}
      <button
        className="btn clear-btn"
        onClick={() => clearCart.mutate({ sessionId: cartSession.id })}
      >
        clear cart
      </button>
    </section>
  )
}

export default Cart
