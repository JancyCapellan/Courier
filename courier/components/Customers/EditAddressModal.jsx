import React from 'react'
import ModalContainer from '../../components/HOC/ModalContainer'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import Axios from 'axios'

const EditAddressModal = ({ show, handleClose, address }) => {
  const initialValues = {
    address: address.address,
    address2: address.address2,
    address3: address.address3,
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
    country: address.country,
    cellphone: address.cellphone,
    telephone: address.telephone,
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

  const updateCustomerAddress = async (values) => {
    try {
      const res = await Axios.put(
        `http://localhost:5000/user/addresses/update/${address.address_id}`,
        values
      )
      if (res.status === 200) {
        alert('UPDATED')
      }
      return res
    } catch (err) {
      console.error('update erorr', err)
      // alert('error')
    }
  }
  //  TODO: after submission, new data is not shown in form unless refresh or search is done
  const onSubmit = async (values) => {
    console.log('edit', values)
    const res = await updateCustomerAddress(values)
    handleClose()
    console.log('update response', res)
  }

  return (
    <ModalContainer show={show} handleClose={handleClose}>
      <h2>Edit Address</h2>
      <Formik
        className='customer-editor-form'
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
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
                name='postal_code'
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

export default EditAddressModal
