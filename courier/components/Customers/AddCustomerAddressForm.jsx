import React, { useEffect } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import axios from 'axios'
import ModalContainer from '../HOC/ModalContainer'
import { useGlobalStore } from '../../store/globalStore'

const AddCustomerAddressForm = ({ show, handleClose, edit }) => {
  // i set select options default here, but will try to make dynamic

  const currentCustomer = useGlobalStore((state) => state.currentCustomer)
  console.log('current user for order', currentCustomer)
  const initialValues = {
    userId: currentCustomer.id,
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

  const AddCustomerAddress = async (values) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/user/addresses/add/${currentCustomer.id}`,
        values
      )
      if (res.status === 200) alert('Successfully Added')
      console.log('add address response', res)
      return res
    } catch (err) {
      console.error(err)
      alert('error')
    }
  }
  //  TODO: after submission, new data is not shown in form unless refresh or search is done
  const onSubmit = async (values) => {
    console.log(values)
    const res = await AddCustomerAddress(values)
    handleClose()
    console.log('CUSTOMER ADD VALUES:', res)
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
