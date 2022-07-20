import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { backendClient } from '../../axiosClient.mjs'
import { useState } from 'react'
import { Formik, Form } from 'formik'
import ModalContainer from '../../HOC/ModalContainer'
import FormikControl from '../../Formik/FormikControl'
import * as Yup from 'yup'

// ! TODO: deleting addresses doesnt work
const UserAddressesTable = ({ setSelectShipperAddress, handleParentModal, userId }) => {
  const [showEditModal, setOpenEditModal] = useState(false)
  const [editAddress, setEditAddress] = useState({})

  console.log('USAT userId', userId)

  const getCustomerAddresses = async (customerId) => {
    const { data } = await backendClient.get('user/addresses/' + customerId)
    return data
  }
  const { data: customerAddresses, status: getCustomerAddressesStatus } = useQuery(
    ['getCustomerAddresses', userId],
    () => getCustomerAddresses(userId)
  )
  return (
    <>
      <section>
        {/* choose address for: {currentCustomer.firstName} {currentCustomer.lastName} */}
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
              <th>utility</th>
            </tr>
            {getCustomerAddressesStatus == 'success' &&
              customerAddresses.map((address) => {
                return (
                  <tr className='customer-table-row' key={address.id}>
                    {/* <td>{address.address_id}</td> */}
                    <td>{address.address}</td>
                    <td>{address.address2}</td>
                    <td>{address.address3}</td>
                    <td>{address.city}</td>
                    <td>{address.state}</td>
                    <td>{address.postalCode}</td>
                    <td>{address.country}</td>
                    <td>{address.cellphone}</td>
                    <td>{address.telephone}</td>
                    <td>
                      {setSelectShipperAddress ? (
                        <button
                          onClick={() => {
                            console.log(address)
                            setSelectShipperAddress(address)
                            {
                              handleParentModal && handleParentModal()
                            }
                          }}
                        >
                          select
                        </button>
                      ) : (
                        <></>
                      )}
                      <button
                        onClick={() => {
                          console.log('edit address', address)
                          setEditAddress(address)
                          setOpenEditModal(true)
                        }}
                      >
                        Edit
                      </button>
                      <button>Delete</button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>

        <EditAddressModal
          showEditModal={showEditModal}
          handleClose={() => setOpenEditModal(false)}
          address={editAddress}
          userId={userId}
        />
      </section>
    </>
  )
}

export default UserAddressesTable

const EditAddressModal = ({ showEditModal, handleClose, address, userId }) => {
  const queryClient = useQueryClient()
  const initialValues = {
    address: address.address,
    address2: address.address2,
    address3: address.address3,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    cellphone: address.cellphone,
    telephone: address.telephone,
  }

  // validation for address form that should be the same any where adress is created or deleted
  const validationSchema = Yup.object({})

  const selectOptions = [
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  const updateCustomerAddress = async (updatedAddressFormValues) => {
    try {
      const { data } = await axios.put(
        `http://localhost:3000/user/addresses/update/${address.id}`,
        updatedAddressFormValues
      )

      return data
    } catch (err) {
      console.error('update erorr', err)
      // alert('error')
    }
  }

  // need address id
  const editAddressMutation = useMutation(updateCustomerAddress, {
    onSuccess: (data) => {
      console.log('edit address', data)
      queryClient.setQueryData(['getCustomerAddresses', userId], (oldData) => {
        const filteredData = oldData.filter((oldAddr) => oldAddr.id !== address.id)
        return [...filteredData, data]
      })
      alert('user info edit completed')
    },
  })

  const onSubmit = (values) => {
    editAddressMutation.mutate(values)
    handleClose()
  }

  return (
    <ModalContainer show={showEditModal} handleClose={handleClose}>
      <h2>Edit Address</h2>
      <Formik
        className='customer-editor-form'
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        // enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form>
              {/* <FormikControl
                control='input'
                type='text'
                name='users_id'
                // value={address.users_id}
                hidden
              />
              <FormikControl
                control='input'
                type='text'
                name='address_id'
                // value={address.users_id}
                disabled
              /> */}
              <FormikControl
                control='select'
                label='Country'
                name='country'
                options={selectOptions}
                // value={address.country}
              />
              <FormikControl
                control='input'
                type='text'
                label='Address line 1'
                name='address'
                // value={address.address}
              />
              <FormikControl
                control='input'
                type='text'
                label='Address line 2'
                name='address2'
                // value={address.address2}
              />
              <FormikControl
                control='input'
                type='text'
                label='Address line 3'
                name='address3'
                // value={address.address3}
              />
              <FormikControl
                control='input'
                type='text'
                label='city'
                name='city'
                // value={address.city}
              />
              <FormikControl
                control='input'
                type='text'
                label='state'
                name='state'
                // value={address.state}
              />
              <FormikControl
                control='input'
                type='text'
                label='postal code'
                name='postalCode'
                // value={address.postal_code}
              />
              <FormikControl
                control='input'
                type='text'
                label='cellphone'
                name='cellphone'
                // value={address.cellphone}
              />
              <FormikControl
                control='input'
                type='text'
                label='telephone'
                name='telephone'
                // value={address.telephone}
              />
              <button type='submit' disabled={!formik.isValid}>
                Submit
              </button>
            </Form>
          )
        }}
      </Formik>
    </ModalContainer>
  )
}
