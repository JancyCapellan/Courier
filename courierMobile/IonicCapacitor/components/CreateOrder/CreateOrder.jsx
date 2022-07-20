import React, { useState } from 'react'
import '../../index.css'
import Services from './Services'
import SenderForm from './SenderForm'
// import './CreateOrder.css'
import Items from './Items'
import Cart from '../Cart/Cart'
import Checkout from './Checkout'
import Sidebar from '../../components/Sidebar'
// import { useCart } from '../../contexts/cartContext'

const CreateOrder = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const handlePage = (pageCode) => {
    if (pageCode === 'NEXT' && currentPage < 3) setCurrentPage(currentPage + 1)
    if (pageCode === 'BACK' && currentPage > 1) setCurrentPage(currentPage - 1)
  }

  function ComponentSwitcher({ handlePage }) {
    switch (currentPage) {
      case 1:
        return <Items handlePage={handlePage} />
      case 2:
        return <Cart handlePage={handlePage} />
      case 3:
        return <SenderForm handlePage={handlePage} />
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

export default CreateOrder
//  Order form  { cart, form, payment}
