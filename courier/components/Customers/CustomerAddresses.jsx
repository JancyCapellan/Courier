import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AddCustomerAddressForm from './AddCustomerAddressForm'
import EditAddressModal from './EditAddressModal'

function CustomerAddresses({ user }) {
  const [addresses, setAddresses] = useState([])
  const [editAddress, setEditAddress] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)

  const handleModalClose = () => {
    // console.log('close modal')
    setShowModal(false)
    setShowAddressModal(false)
  }

  useEffect(() => {
    async function getCustomerAddress() {
      try {
        let res = await axios.get(`http://localhost:5000/user/addresses/${user.id}`)
        if (res.status === 200) {
          // console.table(res.data)
          setAddresses(res.data)
        }
      } catch (error) {
        console.log('getcustomer', error)
      }
    }
    getCustomerAddress()
  }, [])

  return (
    <>
      <section>
        <h2>Addresses for {`${user.first_name}`}</h2>
        <button onClick={() => setShowModal(true)}>Add Address</button>
        <table>
          <tbody>
            <tr>
              {/* <th>Address ID</th> */}
              <th>Address Line 1</th>
              <th>Address Line 2</th>
              <th>Address Line 3</th>
              <th>City</th>
              <th>State</th>
              <th>Postal Code</th>
              <th>Country</th>
              <th>Cellphone</th>
              <th>Telephone</th>
            </tr>
            {addresses.map((address) => {
              return (
                <tr className='customer-table-row' key={address.address_id}>
                  {/* <td>{address.address_id}</td> */}
                  <td>{address.address}</td>
                  {address.address2 ? <td>{address.address2}</td> : <td>N/A</td>}
                  {address.address3 ? <td>{address.address3}</td> : <td>N/A</td>}
                  <td>{address.city}</td>
                  <td>{address.state}</td>
                  <td>{address.postal_code}</td>
                  <td>{address.country}</td>
                  <td>{address.cellphone}</td>
                  <td>{address.telephone}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditAddress(address)
                        setShowAddressModal(true)
                        console.log(address)
                      }}
                    >
                      edit
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      <AddCustomerAddressForm show={showModal} handleClose={handleModalClose} currentUser={user} />
      <EditAddressModal
        show={showAddressModal}
        handleClose={handleModalClose}
        address={editAddress}
      />
    </>
  )
}

export default CustomerAddresses
