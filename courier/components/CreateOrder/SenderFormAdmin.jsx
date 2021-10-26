import React, { useState, useEffect, useRef } from 'react'
import { useCart } from '../../contexts/cartContext'
import '../../index.css'
import { useHistory } from 'react-router'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import axios from 'axios'
import SelectShipperAddress from './selectShipperAddress'

const SenderFormAdmin = ({ currentUser, handlePage }) => {
  const [selectedShipperAddress, setSelectedShipperAddress] = useState({
    address_id: -1,
    address: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    cellphone: '',
    telephone: '',
  })
  const [showModal, setShowModal] = useState(false)
  const { addForm, formDetails } = useCart()

  const history = useHistory()
  // const shipperSelectRef = useRef(null)

  // useEffect(() => {
  //   console.log('selected address', selectedShipperAddress)
  // }, [setSelectedShipperAddress])

  const handleModalClose = () => {
    // console.log('close modal')
    setShowModal(false)
  }

  const selectOptions = [
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]
  const initialValues = {
    shipper: {
      address_id: selectedShipperAddress.address_id,
      id: currentUser.id,
      FirstName: currentUser.first_name,
      LastName: currentUser.last_name,
      Address: selectedShipperAddress.address,
      Address2: selectedShipperAddress.address2,
      Address3: selectedShipperAddress.address3,
      City: selectedShipperAddress.city,
      State: selectedShipperAddress.state,
      PostalCode: selectedShipperAddress.postal_code,
      Country: selectedShipperAddress.country,
      Cellphone: selectedShipperAddress.cellphone,
      Telephone: selectedShipperAddress.telephone,
    },
    reciever: {
      FirstName: '',
      LastName: '',
      Address: '',
      Address2: '',
      Address3: '',
      City: '',
      State: '',
      PostalCode: '',
      Country: 'DR',
      Cellphone: '',
      Telephone: '',
      recipient: true,
    },
  }

  const validationSchema = Yup.object({
    shipper: Yup.object().shape({
      FirstName: Yup.string(),
      LastName: Yup.string(),
      Address: Yup.string(),
      Address2: Yup.string().notRequired(),
      Address3: Yup.string().notRequired(),
      City: Yup.string(),
      State: Yup.string(),
      PostalCode: Yup.string(),
      Country: Yup.string(),
      Cellphone: Yup.string(),
      Telephone: Yup.string().notRequired(),
    }),
    reciever: Yup.object().shape({
      FirstName: Yup.string(),
      LastName: Yup.string(),
      Address: Yup.string(),
      Address2: Yup.string().notRequired(),
      Address3: Yup.string().notRequired(),
      City: Yup.string(),
      State: Yup.string(),
      PostalCode: Yup.string(),
      Country: Yup.string(),
      Cellphone: Yup.string(),
      Telephone: Yup.string().notRequired(),
    }),
  })

  // submit like in checkout using context to pool all necessary data
  const onSubmit = (values) => {
    addForm(values)
    handlePage('NEXT')
    // console.log('form added', formDetails)
  }

  return (
    <section id='deliveryInformation'>
      <h2> Delviery Information</h2>
      <p>{currentUser.first_name}</p>
      <button onClick={() => setShowModal(true)}>select address</button>
      <p>selected address: {selectedShipperAddress.address}</p>
      <SelectShipperAddress
        show={showModal}
        handleClose={handleModalClose}
        setAddress={setSelectedShipperAddress}
        currentUser={currentUser}
      />
      <Formik
        className='registration-form'
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <>
              <Form>
                <h3>Shipper Information</h3>
                {/* <FormikControl
                  control='select'
                  label='Select Address:'
                  name='selectShipperAddress'
                  options={selectOptions}
                  innerRef={shipperSelectRef}
                /> */}
                <FormikControl
                  control='input'
                  type='text'
                  label='First Name'
                  name='shipper.FirstName'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='Last Name'
                  name='shipper.LastName'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='Shipper Address'
                  name='shipper.Address'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='Shipper Address2'
                  name='shipper.Address2'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='Shipper Address3'
                  name='shipper.Address3'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='Shipper City'
                  name='shipper.City'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='shipper State'
                  name='shipper.State'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='shipper Postal Code'
                  name='shipper.PostalCode'
                />
                <FormikControl
                  control='select'
                  label='Country'
                  name='shipper.Country'
                  options={selectOptions}
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='shipper cellphone'
                  name='shipper.Cellphone'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='shipper telephone'
                  name='shipper.Telephone'
                />
                <h3>Reciever information</h3>
                {/* <FormikControl
                  control='select'
                  name='selectRecieverAddress'
                  options={selectOptions}
                /> */}
                <FormikControl
                  control='input'
                  type='text'
                  label='First Name'
                  name='reciever.FirstName'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='Last Name'
                  name='reciever.LastName'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='reciever Address'
                  name='reciever.Address'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='reciever Address2'
                  name='reciever.Address2'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='reciever Address3'
                  name='reciever.Address3'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='reciever City'
                  name='reciever.City'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='reciever State'
                  name='reciever.State'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='reciever Postal Code'
                  name='reciever.PostalCode'
                />
                <FormikControl
                  control='select'
                  label='Country'
                  name='reciever.Country'
                  options={selectOptions}
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='reciever cellphone'
                  name='reciever.Cellphone'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='reciever telephone'
                  name='reciever.Telephone'
                />
                <button type='submit' disabled={!formik.isValid}>
                  Submit
                </button>
              </Form>
            </>
          )
        }}
      </Formik>
    </section>
  )
}

export default SenderFormAdmin
