import React, { useEffect, useState } from 'react'
import CartItem from './CartItem'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import { useGlobalStore } from '@/components/globalStore'
import { useRouter } from 'next/router'

const Cart = () => {
  const router = useRouter()
  const setRefetchCart = useGlobalStore((state) => state.setRefetchCart)

  const [total, setTotal] = useState(0)

  const { data: session, status: sessionStatus } = useSession()

  const [convertedCartItems, setconvertedCartItems] = useState([])

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
      // onSuccess: (data) => {
      //   //TODO combined cart items into one item if they are the same, so that i can later increate or decrease the qty, but in the backend it will take box * 3 and make it into three seperate entry into cartItems
      //   // console.log(data.items)

      //   if (data.items === null) return

      //   const filteredDuplicates = data?.items.filter(
      //     (obj, index) =>
      //       data.items.findIndex((item) => item.productId === obj.productId) ===
      //       index
      //   )

      //   // setconvertedCartItems(cartItemsWithQty)

      //   let combinedItemQty = {}
      //   data.items.forEach((item) => {
      //     combinedItemQty[item.productId] =
      //       (combinedItemQty[item.productId] || 0) + 1
      //   })

      //   filteredDuplicates.forEach((item) => {
      //     item.quantity = combinedItemQty[item.productId]
      //   })

      //   // console.log({ filteredDuplicates })
      //   // console.log({ combinedItemQty })

      //   // * note: only the latest id is passed to CartItem and is the id used to decrease item quantity
      //   setconvertedCartItems(filteredDuplicates)

      //   // console.log({ data })
      // },
    }
  )

  useEffect(() => {
    if (cartSession === undefined) return
    if (cartSession.items === null) return

    const filteredDuplicates = cartSession.items.filter(
      (obj, index) =>
        cartSession.items.findIndex(
          (item) => item.productId === obj.productId
        ) === index
    )

    let combinedItemQty = {}
    cartSession.items.forEach((item) => {
      combinedItemQty[item.productId] =
        (combinedItemQty[item.productId] || 0) + 1
    })

    filteredDuplicates.forEach((item) => {
      item.quantity = combinedItemQty[item.productId]
    })

    // console.log({ filteredDuplicates })
    // console.log({ combinedItemQty })

    // * note: only the latest id is passed to CartItem and is the id used to decrease item quantity
    setconvertedCartItems(filteredDuplicates)
  }, [cartSession])

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
      <p>
        Total Cost: $
        {cartSession?.totalCost
          ? (cartSession?.totalCost / 100).toLocaleString('en')
          : 0}
      </p>
      {/* <p>CartId: {cartSession?.cartId}</p> */}

      {convertedCartItems.map((cartItem) => {
        return (
          <CartItem
            key={cartItem.id}
            {...cartItem}
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
