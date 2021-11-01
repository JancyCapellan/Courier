import React from 'react'
import products from '../../assests/products.json'
import Item from './item'

const jsonProdcutsES = products.spanish

const Items = ({ handlePage }) => {
  return (
    <>
      <h1> Create Order</h1>
      <section>
        <h2> Items</h2>

        <section className='items-section'>
          <div className='itemsList'>
            {jsonProdcutsES.map((item) => {
              return <Item key={item.id} {...item} />
            })}
          </div>
        </section>
        <button onClick={() => handlePage('NEXT')}>NEXT</button>
      </section>
    </>
  )
}

export default Items
