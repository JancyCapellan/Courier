import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import SenderFormAdmin from '@/components/pages/order/CreateOrder/SenderFormAdmin'
import Items from '@/components/pages/order/CreateOrder/Items'
import Cart from '@/components/pages/order/CreateOrder/Cart'
import Checkout from '@/components/pages/order/CreateOrder/Checkout'
import { useGlobalStore } from '@/components/globalStore'
import { trpc } from '@/utils/trpc'

const Order = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: allProducts, status: allProductsStatus } = trpc.useQuery([
    'public.getAllProducts',
  ])

  const customer = useGlobalStore((state) => state.currentCustomer)

  useEffect(() => {
    console.log('customer', customer)
  }, [customer])

  const handlePage = (pageCode) => {
    if (pageCode === 'NEXT' && currentPage < 4) setCurrentPage(currentPage + 1)
    if (pageCode === 'BACK' && currentPage > 1) setCurrentPage(currentPage - 1)
  }

  function ComponentSwitcher({ handlePage }) {
    switch (currentPage) {
      case 1:
        return (
          <SenderFormAdmin currentCustomer={customer} handlePage={handlePage} />
        )
      case 2:
        if (allProductsStatus === 'success')
          return <Items handlePage={handlePage} products={allProducts} />

        return (
          <>
            <h1>ERROR LOADING PRODUCTS</h1>
          </>
        )
      case 3:
        return <Cart handlePage={handlePage} />
      case 4:
        return <Checkout />
      default:
        return <Items handlePage={handlePage} products={allProducts} />
    }
  }

  return (
    <>
      <button onClick={() => handlePage('BACK')}>last</button>
      <span> currentPage: {currentPage} </span>
      <button onClick={() => handlePage('NEXT')}>next</button>
      <ComponentSwitcher handlePage={handlePage} />
      {/* <SenderFormAdmin currentCustomer={customer} handlePage={handlePage} /> */}
    </>
  )
}
export default Order

Order.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
