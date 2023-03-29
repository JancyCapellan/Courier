import { trpc } from '@/utils/trpc'
import React, { useState } from 'react'
import { useQueryClient } from 'react-query'
import * as Yup from 'yup'
import ModalContainer from '@/components/HOC/ModalContainer'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'

const SavedDeliveryAddressesTable = ({
  setDeliveryAddress,
  handleCloseParentModal,
  customerId,
}) => {
  const [showEditModal, setOpenEditModal] = useState(false)
  const [editAddress, setEditAddress] = useState({})

  const {
    data: deliveryAddresses,
    status: getDeliveryAddressesStatus,
    refetch: refetchDeliveryAddresses,
  } = trpc.useQuery(['user.getDeliveryAddresses', { userId: customerId }])

  const deleteDeliveryAddress = trpc.useMutation(
    ['user.deleteDeliveryAddress'],
    {
      onSuccess: (data) => {
        refetchDeliveryAddresses()
      },
    }
  )

  if (getDeliveryAddressesStatus === 'loading') return <div> loading</div>

  return (
    <>
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
          {getDeliveryAddressesStatus == 'success' &&
            deliveryAddresses.map((address) => {
              return (
                <tr className="customer-table-row" key={address.id}>
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
                    {setDeliveryAddress ? (
                      <button
                        onClick={() => {
                          // console.log(address)
                          setDeliveryAddress(address)
                          console.log('func here?', handleCloseParentModal)
                          if (handleCloseParentModal) {
                            console.log('CLOSE MODAL')
                            handleCloseParentModal()
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
                    {/* //TODO: DELETE ADDRESSES MUTATION */}
                    <button
                      onClick={() => {
                        confirm(
                          'DELETE CONFIRMATION: Are you sure you want to DELETE this address?'
                        )
                        deleteDeliveryAddress.mutate({ addressId: address.id })
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>

      <EditDeliveryAddressModal
        showEditModal={showEditModal}
        handleClose={() => setOpenEditModal(false)}
        address={editAddress}
        userId={customerId}
      />
    </>
  )
}

export default SavedDeliveryAddressesTable

const EditDeliveryAddressModal = ({
  showEditModal,
  handleClose,
  address,
  userId,
}) => {
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

  const validationSchema = Yup.object().shape({
    address: Yup.string().required(),
    address2: Yup.string().notRequired(),
    address3: Yup.string().notRequired(),
    city: Yup.string().required(),
    state: Yup.string().required(),
    postalCode: Yup.number().required(),
    country: Yup.string().required(),
    cellphone: Yup.string().required(),
    telephone: Yup.string().notRequired(),
  })

  const selectOptions = [
    { key: 'choose one', value: '' },
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  // need address id
  const editAddressMutation = trpc.useMutation(['user.changeDeliveryAddress'], {
    onSuccess: (data) => {
      console.log('edit address', data)
      queryClient.setQueryData(
        ['user.getDeliveryAddresses', { userId: userId }],
        (oldData) => {
          const filteredData = oldData.filter(
            (oldAddr) => oldAddr.id !== address.id
          )
          return [data, ...filteredData]
        }
      )
      // alert('user info edit completed')
    },
  })

  return (
    <ModalContainer show={showEditModal} handleClose={handleClose}>
      <h2>Edit Address</h2>
      <Formik
        className="customer-editor-form"
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          editAddressMutation.mutate({ addressId: address.id, form: values })
          handleClose()
        }}
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
                control="select"
                label="Country"
                name="country"
                options={selectOptions}
                // value={address.country}
              />
              <FormikControl
                control="input"
                type="text"
                label="Address line 1"
                name="address"
                // value={address.address}
              />
              <FormikControl
                control="input"
                type="text"
                label="Address line 2"
                name="address2"
                // value={address.address2}
              />
              <FormikControl
                control="input"
                type="text"
                label="Address line 3"
                name="address3"
                // value={address.address3}
              />
              <FormikControl
                control="input"
                type="text"
                label="city"
                name="city"
                // value={address.city}
              />
              <FormikControl
                control="input"
                type="text"
                label="state"
                name="state"
                // value={address.state}
              />
              <FormikControl
                control="input"
                type="number"
                label="postal code"
                name="postalCode"
                // value={address.postal_code}
              />
              <FormikControl
                control="input"
                type="text"
                label="cellphone"
                name="cellphone"
                // value={address.cellphone}
              />
              <FormikControl
                control="input"
                type="text"
                label="telephone"
                name="telephone"
                // value={address.telephone}
              />
              <button type="submit" disabled={!formik.isValid}>
                Submit
              </button>
            </Form>
          )
        }}
      </Formik>
    </ModalContainer>
  )
}
