import { usePersistedLocallyStore } from '@/components/globalStore'
import React, { useState } from 'react'
// import { useCart } from '../../contexts/cartContext'

const Item = ({ name, price, id }) => {
  const [qty, setQty] = useState('1')

  const addItemToCart = usePersistedLocallyStore((state) => state.addItemToCart)

  // item to add to cart that will be submitted for order,
  let item = {
    name: `${name}`,
    price: price,
    amount: parseInt(qty),
    productsId: id,
  }

  // if (qty === 1)
  return (
    <article className="">
      <div className="">{name}</div>
      <label className="">
        Qty:
        <select
          id="itemCount"
          className=""
          onChange={(e) => {
            setQty(e.target.value)
          }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </label>
      <button
        className=""
        onClick={() => {
          console.log(item)
          addItemToCart(item)
        }}
      >
        add to cart
      </button>
    </article>
  )
}

export default Item
