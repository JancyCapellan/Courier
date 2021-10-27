import React, { useState } from 'react'
// import '../../index.css'
import Items from './Items'
import Cart from './Cart'
import Sidebar from '../../components/Sidebar'
import SenderFormAdmin from './SenderFormAdmin'
import { useCart } from '../../contexts/cartContext'
import Checkout from './Checkout'

const CreateCustomerOrder = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [value, setValue] = useState('')
  const [user, setUser] = useState()

  const { currentOrderUser } = useCart()

  const handlePage = (pageCode) => {
    if (pageCode === 'NEXT' && currentPage < 4) setCurrentPage(currentPage + 1)
    if (pageCode === 'BACK' && currentPage > 1) setCurrentPage(currentPage - 1)
  }

  function ComponentSwitcher({ handlePage }) {
    switch (currentPage) {
      case 1:
        return <SenderFormAdmin currentUser={currentOrderUser} handlePage={handlePage} />
      case 2:
        return <Items handlePage={handlePage} />
      case 3:
        return <Cart handlePage={handlePage} />
      case 4:
        return <Checkout />
      default:
        return <Items handlePage={handlePage} />
    }
  }

  return (
    <Sidebar>
      <button onClick={() => handlePage('BACK')}>last</button>
      <span> currentPage: {currentPage} </span>
      <button onClick={() => handlePage('NEXT')}>next</button>
      <ComponentSwitcher handlePage={handlePage} />
    </Sidebar>
  )
}

export default CreateCustomerOrder
//  Order form  { cart, form, payment}