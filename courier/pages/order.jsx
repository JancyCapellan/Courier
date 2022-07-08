import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import SenderFormAdmin from '../components/CreateOrder/SenderFormAdmin'
import Items from '../components/CreateOrder/Items'
import Cart from '../components/CreateOrder/Cart'
import Checkout from '../components/CreateOrder/Checkout'
import { useCart } from '../contexts/cartContext'
import { backendClient } from '../components/axiosClient.mjs'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { useGlobalStore } from '../store/globalStore'

const Order = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const getAllProducts = async () => {
    const { data } = await backendClient.get(`http://localhost:3000/services/AllProducts`)
    return data
  }
  const { data: allProducts, status: allProductsStatus } = useQuery(
    'getAllProducts',
    getAllProducts
  )

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
        return <SenderFormAdmin currentCustomer={customer} handlePage={handlePage} />
      case 2:
        return (
          allProductsStatus === 'success' && (
            <Items handlePage={handlePage} products={allProducts} />
          )
        )
      case 3:
        return <Cart handlePage={handlePage} />
      case 4:
        return <Checkout />
      default:
        return <Items handlePage={handlePage} />
    }
  }

  return (
    <>
      <button onClick={() => handlePage('BACK')}>last</button>
      <span> currentPage: {currentPage} </span>
      <button onClick={() => handlePage('NEXT')}>next</button>
      <ComponentSwitcher handlePage={handlePage} />
    </>
  )
}
export default Order

Order.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
