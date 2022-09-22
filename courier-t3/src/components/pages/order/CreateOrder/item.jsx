import { useGlobalStore } from '@/components/globalStore'
import React, { useState } from 'react'
// import { useCart } from '../../contexts/cartContext'

const Item = ({ name, price, id }) => {
  const [qty, setQty] = useState(1)

  const addItemToCart = useGlobalStore((state) => state.addItemToCart)

  // item to add to cart that will be submitted for order,
  let item = {
    name: `${name}`,
    price: price,
    amount: parseInt(qty),
    productsId: id,
  }

  return (
    <article className='itemBox'>
      <div className='itemImage'>{name}</div>
      <label className='labelItemCount'>
        Qty:
        <select
          id='itemCount'
          className='itemCount'
          onChange={(e) => {
            setQty(e.target.value)
          }}
        >
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
        </select>
      </label>
      <button
        className='itemSubmitButton'
        onClick={() => {
          addItemToCart(item)
        }}
      >
        add to cart
      </button>
    </article>
  )
}

export default Item
