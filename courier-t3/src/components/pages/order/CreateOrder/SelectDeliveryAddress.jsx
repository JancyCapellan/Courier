import React, { useState } from 'react'
import ModalContainer from '@/components/HOC/ModalContainer'
import SavedDeliveryAddressesTable from './SavedDeliveryAddressesTable'
import SaveDeliveryAddressForm from './SaveDeliveryAddressForm'

const SelectDeliveryAddress = ({
  show,
  handleClose,
  setAddress,
  currentCustomer,
}) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <ModalContainer show={show} handleClose={handleClose}>
        {/* // delivery  */}
        <button onClick={() => setShowModal(true)}>Add Address</button>
        <SaveDeliveryAddressForm
          customerId={currentCustomer?.id}
          show={showModal}
          handleClose={() => {
            setShowModal(false)
          }}
        />
        <SavedDeliveryAddressesTable
          customerId={currentCustomer?.id}
          setDeliveryAddress={setAddress}
          handleCloseParentModal={handleClose}
        />
      </ModalContainer>
    </>
  )
}

export default SelectDeliveryAddress
