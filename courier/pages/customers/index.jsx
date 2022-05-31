import React, { useState, useEffect } from 'react'
import CustomerTable from '../../components/Customers/main/CustomerTable'
import ModalContainer from '../../components/HOC/ModalContainer'
import RegistrationFormModal from '../../components/RegistrationFormModal'
import Layout from '../../components/Layout'

const Customers = () => {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState(value)
  const [selectedCustomer, setSelectedCustomer] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const handleModalClose = () => {
    console.log('close modal')
    setShowModal(false)
    setShowEditor(false)
  }

  const handleSubmit = (e) => {
    setSelectedCustomer({})
    e.preventDefault()
    setSearch(value)
  }

  useEffect(() => {
    console.log('currrentUser', selectedCustomer)
  }, [selectedCustomer, setSelectedCustomer])

  return (
    <>
      <div className='customer-page-container'>
        <h1 className='page-title'>Customer Manager</h1>

        <div className='customer-search'>
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
        </div>

        {/* opens modal form */}
        <button className='btn-31 add-customer-btn' onClick={() => setShowModal(true)}>
          Create Customer
        </button>
        <ModalContainer show={showModal} handleClose={handleModalClose}>
          <RegistrationFormModal staff={false} customer={true} handleClose={handleModalClose} />
        </ModalContainer>

        <CustomerTable
          search={search}
          setCurrentUser={setSelectedCustomer}
          setShowEditor={setShowEditor}
        />
      </div>
    </>
  )
}
export default Customers

Customers.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
