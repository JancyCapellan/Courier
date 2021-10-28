import React, { useEffect } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import Axios from 'axios'

const AddCustomerAddressForm = ({ show, handleClose, currentUser, edit }) => {
  const showHideClassName = show ? 'd-block' : 'd-none'

  // i set select options default here, but will try to make dynamic
  const initialValues = {
    users_id: `${currentUser.id}`,
    address: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    postal_Code: '',
    country: 'USA',
    cellphone: '',
    telephone: '',
  }

  // Schema for yup
  const validationSchema = Yup.object({})

  const selectOptions = [
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  // useEffect(() => {
  //   console.log('test')
  // }, [])

  const AddCustomerAddress = async (values) => {
    try {
      const res = await Axios.post(
        `http://localhost:3000/user/addresses/add/${currentUser.id}`,
        values
      )
      if (res.status === 200) alert('Successfully Added')
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
    <div className={showHideClassName}>
      <div className='modal-container'>
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
                <FormikControl
                  control='input'
                  type='text'
                  label='Address line 1'
                  name='address'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='Address line 2'
                  name='address2'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='Address line 3'
                  name='address3'
                />
                <FormikControl control='input' type='text' label='city' name='city' />
                <FormikControl control='input' type='text' label='state' name='state' />
                <FormikControl
                  control='input'
                  type='text'
                  label='postal code'
                  name='postal_code'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='cellphone'
                  name='cellphone'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='telephone'
                  name='telephone'
                />
                <button type='submit' disabled={!formik.isValid}>
                  Submit
                </button>
              </Form>
            )
          }}
        </Formik>
        <button className='modal-close' onClick={handleClose}>
          close
        </button>
      </div>
    </div>
  )
}

export default AddCustomerAddressForm
