import React, { useState, useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import * as Yup from 'yup'
import SelectCustomerAddressesModal from './selectCustomerAddressesModal'
import {
  useGlobalStore,
  usePersistedLocallyStore,
} from '@/components/globalStore'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useGlobalFilter } from 'react-table'
import { set } from 'zod'

const SenderFormAdmin = () => {
  const router = useRouter()
  const customerId = router.query.customerId
  console.log(
    '🚀 ~ file: SenderFormAdmin.jsx ~ line 19 ~ SenderFormAdmin ~ customerId',
    customerId
  )
  const { data: session, status: sessionStatus } = useSession()
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
  // console.log(
  //   '🚀 ~ file: SenderFormAdmin.jsx ~ line 25 ~ SenderFormAdmin ~ formValues',
  //   formValues
  // )

  const setRefetchCartAddresses = useGlobalStore(
    (state) => state.setRefetchCartAddresses
  )

  const refetchCart = useGlobalStore((state) => state.refetchCart)

  const {
    data: formDetails,
    status: formDetailsStatus,
    refetch: refetchCartAddresses,
  } = trpc.useQuery(
    [
      'cart.getAddressesFromCart',
      { userId: session?.user?.id, customerId: customerId },
    ],
    {
      enabled: sessionStatus === 'authenticated',
    }
  )
  // console.log(
  //   '🚀 ~ file: SenderFormAdmin.jsx ~ line 32 ~ SenderFormAdmin ~ formDetails',
  //   formDetails
  // )
  const saveAddressesFormToCart = trpc.useMutation([
    'cart.saveAddressesFormToCart',
  ])

  const { data: currentCustomer, status: customerInfoQueryStatus } =
    trpc.useQuery(['user.getUserAccountInfo', { userId: customerId }])

  useEffect(() => {
    setRefetchCartAddresses(refetchCartAddresses)
  }, [refetchCartAddresses])

  useEffect(() => {
    console.log(
      '🚀 ~ file: SenderFormAdmin.jsx ~ line 68 ~ SenderFormAdmin ~ formDetails',
      formDetails
    )
    if (formDetails == null) {
      console.log('form set to intital values')
      return
    }

    setFormValues({
      shipper: formDetails[0],
      reciever: formDetails[1],
    })

    return () => {}
  }, [formDetails])

  // console.log(
  //   '🚀 ~ file: SenderFormAdmin.jsx ~ line 77 ~ SenderFormAdmin ~ formValues',
  //   formValues
  // )

  const selectOptions = [
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  const initialValues = {
    shipper: {
      // userId: currentCustomer?.id,
      firstName: currentCustomer?.firstName,
      lastName: currentCustomer?.lastName,
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
      recipient: false,
    },
    reciever: {
      firstName: '',
      lastName: '',
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
  }

  const validationSchema = Yup.object({
    shipper: Yup.object().shape({
      firstName: Yup.string(),
      lastName: Yup.string(),
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
    reciever: Yup.object().shape({
      firstName: Yup.string(),
      lastName: Yup.string(),
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
  })

  // submit like in checkout using context to pool all necessary data
  const onSubmit = (values) => {
    // addForm(values)

    console.log('adding order form to store', values)
    //  !add form to globalstore currentOrder object
    // addFormToOrder(values)
    saveAddressesFormToCart.mutate({
      userId: session?.user?.id,
      customerId: customerId,
      ...values,
    })

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
        initialValues={formValues || initialValues}
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
                      name="shipper.address"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Shipper Address2"
                      name="shipper.address2"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Shipper Address3"
                      name="shipper.address3"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="Shipper City"
                      name="shipper.city"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="shipper State"
                      name="shipper.state"
                    />
                    <FormikControl
                      control="input"
                      type="number"
                      label="shipper Postal Code"
                      name="shipper.postalCode"
                    />
                    <FormikControl
                      control="select"
                      label="Country"
                      name="shipper.country"
                      options={selectOptions}
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="shipper cellphone"
                      name="shipper.cellphone"
                    />
                    <FormikControl
                      control="input"
                      type="text"
                      label="shipper telephone"
                      name="shipper.telephone"
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
                      name="reciever.address"
                    />
                    <FormikControl
                      control="input"
                      label="reciever Address2"
                      name="reciever.address2"
                    />
                    <FormikControl
                      control="input"
                      label="reciever Address3"
                      name="reciever.address3"
                    />
                    <FormikControl
                      control="input"
                      label="reciever City"
                      name="reciever.city"
                    />
                    <FormikControl
                      control="input"
                      label="reciever State"
                      name="reciever.state"
                    />
                    <FormikControl
                      control="input"
                      type="number"
                      label="reciever Postal Code"
                      name="reciever.postalCode"
                    />
                    <FormikControl
                      control="select"
                      label="Country"
                      name="reciever.country"
                      options={selectOptions}
                    />
                    <FormikControl
                      control="input"
                      label="reciever cellphone"
                      name="reciever.cellphone"
                    />
                    <FormikControl
                      control="input"
                      label="reciever telephone"
                      name="reciever.telephone"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formik.isValid}
                  onClick={() => refetchCart()}
                  className={`btn w-auto bg-red-600`}
                >
                  Confirm and save addresses to shopping Cart
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
