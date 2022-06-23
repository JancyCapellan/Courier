import React, { useState, useEffect } from 'react'
import CustomerTable from '../../components/Customers/CustomerTable'
import ModalContainer from '../../components/HOC/ModalContainer'
import RegistrationFormModal from '../../components/RegistrationFormModal'
import Layout from '../../components/Layout'
import { useGlobalStore } from '../../store/globalStore'
import CustomerReactTable from '../../components/Customers/CustomerReactTable.jsx'

const Customers = () => {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState(value)

  // const [selectedCustomer, setSelectedCustomer] = useState({})

  const [showModal, setShowModal] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const currentCustomer = useGlobalStore((state) => state.currentCustomer)

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const handleSubmit = (e) => {
    setSelectedCustomer({})
    e.preventDefault()
    setSearch(value)
  }

  return (
    <>
      <div className='customer-page-container'>
        {/* <h1 className='page-title'>Customer Manager</h1> */}

        {/* <div className='customer-search'>
          <form className='customer-search-form' onSubmit={handleSubmit}>
            <label className='customer-search-label' htmlFor='search'>
              Search Customer
              <input
                value={value}
                id='search'
                className='customer-search'
                placeholder='Search Customer'
                onChange={(e) => setValue(e.target.value)}
              ></input>
            </label>
            <button form='searchForm' onSubmit={() => handleSubmit()}>
              search
            </button>
          </form>
        </div> */}

        <button className='btn-31 add-customer-btn' onClick={() => toggleModal()}>
          Create Customer
        </button>
        <ModalContainer show={showModal} handleClose={toggleModal}>
          <RegistrationFormModal isRegisteringStaff={false} closeModal={toggleModal} />
        </ModalContainer>

        {/* <CustomerTable search={search} /> */}
        <CustomerReactTable />
      </div>
    </>
  )
}
export default Customers

Customers.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
