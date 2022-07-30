import React, { useEffect } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import axios from 'axios'
import ModalContainer from '../HOC/ModalContainer'
import { useQueryClient, useMutation } from 'react-query'
import { backendClient } from '../../components/axiosClient.mjs'

const AddCustomerAddressForm = ({ customerId, show, handleClose }) => {
  const queryClient = useQueryClient()
  // i set select options default here, but will try to make dynamic
  // console.log('current user for order', currentCustomer)
  const initialValues = {
    userId: customerId,
    address: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    cellphone: '',
    telephone: '',
  }

  // Schema for yup
  const validationSchema = Yup.object({})

  // ! turn this into dynamic option by adding CRUD DB API operations
  const selectOptions = [
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  const addCustomerAddress = async (values) => {
    // let id = currentCustomer.id
    // if (customerId) id = customerId

    try {
      const { data } = await backendClient.post(`/user/addresses/add/${customerId}`, values)
      return data
    } catch (err) {
      console.error(err)
      alert('error')
    }
  }

  const mutation = useMutation(addCustomerAddress, {
    onSuccess: (data) => {
      alert('user address edit completed')
      queryClient.setQueryData(['getCustomerAddresses', customerId], (oldData) => {
        return [...oldData, data]
      })
      alert('user address edit completed')
    },
  })

  const onSubmit = async (values) => {
    mutation.mutate(values)
    handleClose()
  }

  return (
    <>
      <ModalContainer show={show} handleClose={handleClose}>
        <h2>Add Address</h2>
        <Formik
          className='customer-editor-form'
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <FormikControl control='input' type='text' name='users_id' hidden />
                <FormikControl
                  control='select'
                  label='Country'
                  name='country'
                  options={selectOptions}
                />
                <FormikControl control='input' type='text' label='Address line 1' name='address' />
                <FormikControl control='input' type='text' label='Address line 2' name='address2' />
                <FormikControl control='input' type='text' label='Address line 3' name='address3' />
                <FormikControl control='input' type='text' label='City' name='city' />
                <FormikControl control='input' type='text' label='State' name='state' />
                <FormikControl control='input' type='text' label='Postal code' name='postalCode' />
                <FormikControl control='input' type='text' label='Cellphone' name='cellphone' />
                <FormikControl control='input' type='text' label='Telephone' name='telephone' />
                <button type='submit' disabled={!formik.isValid}>
                  Submit
                </button>
              </Form>
            )
          }}
        </Formik>
      </ModalContainer>
    </>
  )
}

export default AddCustomerAddressForm
