import { useState } from 'react'
import UserAddressesTable from '@/components/pages/customers/[userId]/UserAddressesTable'
import AddCustomerAddressForm from '@/components/pages/customers/AddCustomerAddressForm'

export const CustomerAddresses = ({
  currentUser,
  setSelectedShipperAddress,
  handleCloseParentModal,
}) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <section>
        <h2>
          Addresses for {`${currentUser.firstName}`} {`${currentUser.lastName}`}
        </h2>
        <button onClick={() => setShowModal(true)}>Add Address</button>
        <AddCustomerAddressForm
          customerId={currentUser.id}
          show={showModal}
          handleClose={() => {
            setShowModal(false)
          }}
        />
        <UserAddressesTable
          userId={currentUser.id}
          setSelectShipperAddress={setSelectedShipperAddress}
          handleCloseParentModal={handleCloseParentModal}
        />
      </section>
    </>
  )
}
