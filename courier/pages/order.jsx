import { useState } from 'react'
import Layout from '../components/Layout'
import SenderFormAdmin from '../components/CreateOrder/SenderFormAdmin'
import Items from '../components/CreateOrder/Items'
import Cart from '../components/CreateOrder/Cart'
import Checkout from '../components/CreateOrder/Checkout'
import { useCart } from '../contexts/cartContext'
import axios from 'axios'

export const getServerSideProps = async ({ res }) => {
  try {
    const result = await axios.get(`http://localhost:3000/order/allProducts`)
    return {
      props: {
        products: result.data,
      },
    }
  } catch (error) {
    res.statusCode = 500
    console.log('getcustomer', error)
    return {
      props: {},
    }
  }
}

const Order = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1)
  // const [value, setValue] = useState('')
  // const [user, setUser] = useState()

  const { currentOrderUser } = useCart()
  // useEffect(() => {
  //   console.log('Order for user', currentOrderUser)
  // }, [])

  const handlePage = (pageCode) => {
    if (pageCode === 'NEXT' && currentPage < 4) setCurrentPage(currentPage + 1)
    if (pageCode === 'BACK' && currentPage > 1) setCurrentPage(currentPage - 1)
  }

  function ComponentSwitcher({ handlePage }) {
    switch (currentPage) {
      case 1:
        return <SenderFormAdmin currentUser={currentOrderUser} handlePage={handlePage} />
      case 2:
        return <Items handlePage={handlePage} products={products} />
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
