import React, { useState, useEffect } from 'react'
import CustomerTable from '../../components/Customers/main/CustomerTable'
import ModalContainer from '../../components/HOC/ModalContainer'
import RegistrationForm from '../../components/RegistrationForm'
import Layout from '../../components/Layout'

const Customers = () => {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState(value)
  const [currentUser, setCurrentUser] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const handleModalClose = () => {
    console.log('close modal')
    setShowModal(false)
    setShowEditor(false)
  }

  const handleSubmit = (e) => {
    setCurrentUser({})
    e.preventDefault()
    setSearch(value)
  }

  useEffect(() => {
    console.log('currrentUser', currentUser)
  }, [currentUser, setCurrentUser])

  return (
    <>
      <div className='customer-manager-page'>
        <h1 className='page-title'>Customer Manager</h1>
        <div className='customer-search'>
          <form id='searchForm' onSubmit={handleSubmit}>
            <label className='customer-search-label' htmlFor='search'>
              Search Customer:
              <input
                value={value}
                id='search'
                className='customer-search'
                placeholder='any field'
                onChange={(e) => setValue(e.target.value)}
              ></input>
            </label>
          </form>
          <button form='searchForm' className='customer-search-btn' onSubmit={handleSubmit}>
            search
          </button>
        </div>

        {/* opens modal form */}
        <button className='btn add-customer-btn' onClick={() => setShowModal(true)}>
          Add Customer
        </button>

        <CustomerTable
          search={search}
          setCurrentUser={setCurrentUser}
          setShowEditor={setShowEditor}
        />
      </div>
      <ModalContainer show={showModal} handleClose={handleModalClose}>
        <RegistrationForm staff={false} customer={true} />
      </ModalContainer>
    </>
  )
}
export default Customers

Customers.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
