import React, { useState, useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import * as Yup from 'yup'
import SelectCustomerAddressesModal from './selectCustomerAddressesModal'
import { usePersistedLocallyStore } from '@/components/globalStore'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

const SenderFormAdmin = () => {
  const [selectedShipperAddress, setSelectedShipperAddress] = useState({
    address: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    cellphone: '',
    telephone: '',
  })
  const [showModal, setShowModal] = useState(false)
  const [formValues, setFormValues] = useState(null)
  const { data: session, status: sessionStatus } = useSession()

  const { data: formDetails, status: formDetailsStatus } = trpc.useQuery(
    ['cart.getAddressesFromCart', { userId: session?.user?.id }],
    {
      enabled: sessionStatus === 'authenticated',
    }
  )
  const saveFormToCart = trpc.useMutation(['cart.saveAddressesFormToCart'])

  const router = useRouter()
  const customerId = router.query.customerId

  const { data: currentCustomer, status: customerInfoQueryStatus } =
    trpc.useQuery(['user.getUserAccountInfo', { userId: customerId }])

  const selectOptions = [
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]
  // get addresses fromm user cart and make then inital values or change the form values to them
  const initialValues = {
    shipper: {
      userId: currentCustomer?.id,
      firstName: currentCustomer?.firstName,
      lastName: currentCustomer?.lastName,
      shippedFrom: {
        // addressId: selectedShipperAddress.id,
        address: selectedShipperAddress.address,
        address2: selectedShipperAddress.address2,
        address3: selectedShipperAddress.address3,
        city: selectedShipperAddress.city,
        state: selectedShipperAddress.state,
        postalCode: selectedShipperAddress.postalCode,
        country: selectedShipperAddress.country,
        cellphone: selectedShipperAddress.cellphone,
        telephone: selectedShipperAddress.telephone,
        // default: false,
      },
    },
    reciever: {
      firstName: '',
      lastName: '',
      shippedTo: {
        address: '',
        address2: '',
        address3: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'DR',
        cellphone: '',
        telephone: '',
        recipient: true, // needed for cart addresses primary key
      },
    },
  }

  const validationSchema = Yup.object({
    shipper: Yup.object().shape({
      firstName: Yup.string(),
      lastName: Yup.string(),
      shippedFrom: Yup.object({
        address: Yup.string(),
        address2: Yup.string().notRequired(),
        address3: Yup.string().notRequired(),
        city: Yup.string(),
        state: Yup.string(),
        postalCode: Yup.number(),
        country: Yup.string(),
        cellphone: Yup.string(),
        telephone: Yup.string().notRequired(),
      }),
    }),
    reciever: Yup.object().shape({
      firstName: Yup.string(),
      lastName: Yup.string(),
      shippedTo: Yup.object({
        address: Yup.string(),
        address2: Yup.string().notRequired(),
        address3: Yup.string().notRequired(),
        city: Yup.string(),
        state: Yup.string(),
        postalCode: Yup.number(),
        country: Yup.string(),
        cellphone: Yup.string(),
        telephone: Yup.string().notRequired(),
      }),
    }),
  })

  // submit like in checkout using context to pool all necessary data
  const onSubmit = (values) => {
    // addForm(values)

    console.log('adding order form to store', values)
    //  !add form to globalstore currentOrder object
    // addFormToOrder(values)
    saveFormToCart.mutate({ userId: session?.user?.id, ...values })

    // handlePage && handlePage('NEXT')
    // console.log('form added', formDetails)
  }

  if (customerInfoQueryStatus === 'loading' || formDetailsStatus === 'loading')
    return <div>Loading...</div>

  return (
    <section id="deliveryInformation">
      {/* <h1> Delviery Information</h1> */}

      <button className="btn btn-blue" onClick={() => setShowModal(true)}>
        select address
      </button>
      <SelectCustomerAddressesModal
        show={showModal}
        handleClose={() => {
          setShowModal(false)
        }}
        setAddress={setSelectedShipperAddress}
        currentCustomer={currentCustomer}
      />

      {/* <p>selected address: {selectedShipperAddress.address}</p> */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <>
              <Form className="flex flex-col justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="orderform-shipper">
                    <h3>Shipper</h3>
                    {/* <FormikControl
                    control='select'
                    label='Select Address:'
                    name='selectShipperAddress'
                    options={selectOptions}
                    innerRef={shipperSelectRef}
                  /> */}
                    <FormikControl
                      control="input"
                      type="text"
                      label="First Name"
                      name="shipper.firstName"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Last Name"
                      name="shipper.lastName"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Shipper Address"
                      name="shipper.shippedFrom.address"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Shipper Address2"
                      name="shipper.shippedFrom.address2"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Shipper Address3"
                      name="shipper.shippedFrom.address3"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Shipper City"
                      name="shipper.shippedFrom.city"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="shipper State"
                      name="shipper.shippedFrom.state"
                    />
                    <FormikControl
                      control="input"
                      type="number"
                      label="shipper Postal Code"
                      name="shipper.shippedFrom.postalCode"
                    />
                    <FormikControl
                      control="select"
                      label="Country"
                      name="shipper.shippedFrom.country"
                      options={selectOptions}
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="shipper cellphone"
                      name="shipper.shippedFrom.cellphone"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="shipper telephone"
                      name="shipper.shippedFrom.telephone"
                    />
                  </div>
                  <div className="orderform-reciever">
                    <h3>Reciever</h3>
                    {/* <FormikControl
                  control='select'
                  name='selectRecieverAddress'
                  options={selectOptions}
                /> */}
                    <FormikControl
                      control="input"
                      label="First Name"
                      name="reciever.firstName"
                    />
                    <FormikControl
                      control="input"
                      label="Last Name"
                      name="reciever.lastName"
                    />
                    <FormikControl
                      control="input"
                      label="reciever Address"
                      name="reciever.shippedTo.address"
                    />
                    <FormikControl
                      control="input"
                      label="reciever Address2"
                      name="reciever.shippedTo.address2"
                    />
                    <FormikControl
                      control="input"
                      label="reciever Address3"
                      name="reciever.shippedTo.address3"
                    />
                    <FormikControl
                      control="input"
                      label="reciever City"
                      name="reciever.shippedTo.city"
                    />
                    <FormikControl
                      control="input"
                      label="reciever State"
                      name="reciever.shippedTo.state"
                    />
                    <FormikControl
                      control="input"
                      type="number"
                      label="reciever Postal Code"
                      name="reciever.shippedTo.postalCode"
                    />
                    <FormikControl
                      control="select"
                      label="Country"
                      name="reciever.shippedTo.country"
                      options={selectOptions}
                    />
                    <FormikControl
                      control="input"
                      label="reciever cellphone"
                      name="reciever.shippedTo.cellphone"
                    />
                    <FormikControl
                      control="input"
                      label="reciever telephone"
                      name="reciever.shippedTo.telephone"
                    />
                  </div>
                </div>

                <button type="submit" disabled={!formik.isValid}>
                  save to order
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
