import {
  useGlobalStore,
  usePersistedLocallyStore,
} from '@/components/globalStore'
// import { useSession } from '@/components/hooks/useSession'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
// import { useCart } from '../../contexts/cartContext'

const Item = ({ name, price, id }) => {
  const [qty, setQty] = useState('1')

  const router = useRouter()

  // const addItemToCart = usePersistedLocallyStore((state) => state.addItemToCart)
  // the cart is local for the current page, but i want it to be on DB
  //

  const refetchCart = useGlobalStore((state) => state.refetchCart)
  const addToCartSession = trpc.useMutation(['cart.addToCartSession'], {
    onSuccess: () => refetchCart(),
  })

  // const session = useSession()
  const { data: session, status } = useSession()
  // console.log('item currentUserSession', session)

  // item to add to cart that will be submitted for order,
  let item = {
    amount: parseInt(qty),
    productId: id,
  }

  // if (qty === 1)
  return (
    <article className="">
      <div className="">
        {name}: ${price / 100}
      </div>
      <label htmlFor="quantity">
        <input
          type="number"
          id="quantity"
          name="quantity"
          onChange={(e) => {
            console.log('qty change')
            setQty(e.target.value)
          }}
          defaultValue={1}
          min="1"
          // max="5"
        />
      </label>
      {/* <label className=""> */}
      {/*   Qty: */}
      {/* <select */}
      {/*   id="itemCount" */}
      {/*   className="" */}
      {/*   onChange={(e) => { */}
      {/*     setQty(e.target.value) */}
      {/*   }} */}
      {/* > */}
      {/*   <option value="1">1</option> */}
      {/*   <option value="2">2</option> */}
      {/*   <option value="3">3</option> */}
      {/*   <option value="4">4</option> */}
      {/*   <option value="5">5</option> */}
      {/* </select> */}
      {/* </label> */}
      <button
        className=""
        onClick={() => {
          if (status === 'authenticated')
            addToCartSession.mutate({
              userId: session?.user?.id,
              customerId: router.query.customerId,
              item: item,
            })
        }}
      >
        add to cart
      </button>
    </article>
  )
}

export default Item
