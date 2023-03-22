import React, { useEffect, useState } from 'react'
// import products from '@/components/pages/customers/order/CreateOrder/products.json'
import Item from './item'
import { trpc } from '@/utils/trpc'

// const jsonProdcutsES = products.spanish

const Items = () => {
  const { data: allProducts, status: allProductsStatus } = trpc.useQuery([
    'public.getAllProducts',
  ])
  return (
    <>
      <section>
        <h1> Products</h1>

        <section className="items-section">
          <div className="itemsList">
            {allProductsStatus === 'success' ? (
              allProducts.map((item) => {
                return <Item key={item.id} {...item} />
              })
            ) : (
              <></>
            )}
          </div>
        </section>
        {/* <button onClick={() => handlePage('NEXT')}>NEXT</button> */}
      </section>
    </>
  )
}

export default Items
