import React, { useState, useEffect } from 'react'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import AddCustomerAddressForm from '../Customers/AddCustomerAddressForm'
import { useQuery } from 'react-query'

const SelectCustomerAddressesModal = ({ show, handleClose, currentUser, setAddress }) => {
  const [addresses, setAddresses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)

  const handleCloseAddAddressFormModal = () => {
    setShowAddForm(false)
  }

  // const getUserAddress  = async () => {
  //   const {addresses } = await axios.get( process.env.API_URI)
  // }
  useEffect(() => {
    let isMounted = true

    async function getCustomerAddress() {
      try {
        let res = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + 'user/addresses/' + currentUser.id
        )
        if (res.status === 200 && isMounted) {
          console.table(res.data)
          setAddresses(res.data)
        }
      } catch (error) {
        console.log('getcustomer error', error)
      }
    }

    getCustomerAddress()
    console.log('CU', currentUser, addresses)

    return () => {
      isMounted = false
    }
  }, [])

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
        <AddCustomerAddressForm
          show={showAddForm}
          handleClose={handleCloseAddAddressFormModal}
          currentUser={currentUser}
        />
        <section>
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
