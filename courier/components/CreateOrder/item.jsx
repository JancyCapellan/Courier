import React, { useState } from 'react'
import { useCart } from '../../contexts/cartContext'

const Item = ({ name, price, id }) => {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()

  // let itemArray = [`${name}`, parseInt(qty)]
  let item = {
    name: `${name}`,
    price: 75,
    amount: parseInt(qty),
    productsId: id,
  }

  const add = () => {
    addItem(item)
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
      <button className='itemSubmitButton' onClick={add}>
        add to cart
      </button>
    </article>
  )
}

export default Item
