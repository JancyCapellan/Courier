import React, { useState } from 'react'
import ModalContainer from '@/components/HOC/ModalContainer'
import AddCustomerAddressForm from '@/components/pages/customers/AddCustomerAddressForm'
import UserAddressesTable from '@/components/pages/customers/[userId]/UserAddressesTable'
import { useGlobalStore } from '@/components/globalStore'
import { CustomerAddresses } from '../../customers/CustomerAddresses'

//opens from the customer order form page wiht the select address button
const SelectCustomerAddressesModal = ({ show, handleClose, setAddress }) => {
  const currentCustomer = useGlobalStore((state) => state.currentCustomer)

  return (
    <>
      <ModalContainer show={show} handleClose={handleClose}>
        {/* <button
          onClick={() => {
            setShowAddForm(true)
          }}
        >
          create new customer address
        </button> */}
        <CustomerAddresses
          currentUser={currentCustomer}
          setSelectedShipperAddress={setAddress}
          handleCloseParentModal={handleClose}
        />
      </ModalContainer>
    </>
  )
}

export default SelectCustomerAddressesModal
