import React, { useEffect, useState } from 'react'
// import products from '@/components/pages/customers/order/CreateOrder/products.json'
import Item from './item'
import { trpc } from '@/utils/trpc'

// const jsonProdcutsES = products.spanish

const Items = ({ handlePage }) => {
  const { data: allProducts, status: allProductsStatus } = trpc.useQuery([
    'public.getAllProducts',
  ])
  return (
    <>
      <h1> Create Order</h1>
      <section>
        <h2> Items</h2>

        <section className='items-section'>
          <div className='itemsList'>
            {products.map((item) => {
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
