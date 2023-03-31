import { useState } from 'react'
import SaveDeliveryAddressForm from '../../order/CreateOrder/SaveDeliveryAddressForm'
import SavedDeliveryAddressesTable from '../../order/CreateOrder/SavedDeliveryAddressesTable'

const CustomerDeliveryAddresses = ({ currentCustomerId }) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <section>
        <h2>Saved Delivery Address</h2>
        <button onClick={() => setShowModal(true)}>Add Address</button>
        <SaveDeliveryAddressForm
          customerId={currentCustomerId}
          show={showModal}
          handleClose={() => {
            setShowModal(false)
          }}
        />
        <SavedDeliveryAddressesTable customerId={currentCustomerId} />
      </section>
    </>
  )
}

export default CustomerDeliveryAddresses
