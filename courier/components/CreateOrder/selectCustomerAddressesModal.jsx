import React, { useState } from 'react'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import AddCustomerAddressForm from '../Customers/AddCustomerAddressForm'
import { useQuery } from 'react-query'
import { useGlobalStore } from '../../store/globalStore'
import UserAddressesTable from '../Customers/[userId]/UserAddressesTable'

//opens from the customer order form page wiht the select address button
const SelectCustomerAddressesModal = ({ show, handleClose, setAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false)

  const currentCustomer = useGlobalStore((state) => state.currentCustomer)

  return (
    <>
      <ModalContainer show={show} handleClose={handleClose}>
        <button
          onClick={() => {
            setShowAddForm(true)
          }}
        >
          create new customer address
        </button>
        <AddCustomerAddressForm show={showAddForm} handleClose={() => setShowAddForm(false)} />
        <section>
          choose address for: {currentCustomer.firstName} {currentCustomer.lastName}
          <UserAddressesTable
            setSelectShipperAddress={setAddress}
            handleParentModal={handleClose}
            userId={currentCustomer.id}
          />
        </section>
      </ModalContainer>
    </>
  )
}

export default SelectCustomerAddressesModal
