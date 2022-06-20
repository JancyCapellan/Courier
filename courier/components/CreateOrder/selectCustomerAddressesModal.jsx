import React, { useState, useEffect } from 'react'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import AddCustomerAddressForm from '../Customers/AddCustomerAddressForm'
import { useQuery } from 'react-query'
import { useGlobalStore } from '../../store/globalStore'

//opens from the customer order form page wiht the select address button
const SelectCustomerAddressesModal = ({ show, handleClose, setAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false)

  const currentCustomer = useGlobalStore((state) => state.currentCustomer)

  const handleCloseAddAddressFormModal = () => {
    setShowAddForm(false)
  }

  const getCustomerAddresses = async () => {
    const { data } = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + 'user/addresses/' + currentCustomer.id
    )
    return data
  }
  const { data: customerAddresses, status: getCustomerAddressesStatus } = useQuery(
    'getCustomerAddresses',
    getCustomerAddresses
  )

  return (
    <>
      <ModalContainer show={show} handleClose={handleClose}>
        <button
          onClick={() => {
            setShowAddForm(true)
          }}
        >
          add address
        </button>
        <AddCustomerAddressForm show={showAddForm} handleClose={handleCloseAddAddressFormModal} />
        <section>
          choose address for: {currentCustomer.firstName} {currentCustomer.lastName}
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
              {getCustomerAddressesStatus == 'success' &&
                customerAddresses.map((address) => {
                  return (
                    <tr
                      className='customer-table-row'
                      key={address.address_id}
                      onClick={() => {
                        console.log(address)
                        setAddress(address)
                        handleClose()
                      }}
                    >
                      {/* <td>{address.address_id}</td> */}
                      <td>{address.address}</td>
                      <td>{address.address2}</td>
                      <td>{address.address3}</td>
                      <td>{address.city}</td>
                      <td>{address.state}</td>
                      <td>{address.postal_code}</td>
                      <td>{address.country}</td>
                      <td>{address.cellphone}</td>
                      <td>{address.telephone}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </section>
      </ModalContainer>
    </>
  )
}

export default SelectCustomerAddressesModal
