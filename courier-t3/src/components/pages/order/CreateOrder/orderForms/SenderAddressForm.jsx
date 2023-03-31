import React, { useState, useEffect } from 'react'
import { Formik, Form, FormikProvider } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import SelectCustomerAddressesModal from '../selectCustomerAddressesModal'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { useSession } from 'next-auth/react'

const SenderAddressForm = () => {
  const { data: session, status: sessionStatus } = useSession()
  const [showModal, setShowModal] = useState(false)
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

  const router = useRouter()
  const customerId = router.query.customerId

  const { data: currentCustomer, status: customerInfoQueryStatus } =
    trpc.useQuery(['user.getUserAccountInfo', { userId: customerId }])

  const saveShipperPickupAddressToCart = trpc.useMutation([
    'cart.saveShipperPickupAddressToCart',
  ])

  const [formValues, setFormValues] = useState(null)
  const {
    data: formDetails,
    status: formDetailsStatus,
    // refetch: refetchCartAddresses,
  } = trpc.useQuery(
    [
      'cart.getShipperAddressFromCart',
      { userId: session?.user?.id, customerId: customerId },
    ],
    {
      enabled: sessionStatus === 'authenticated',
    }
  )

  useEffect(() => {
    if (formDetails == null) {
      return
    }

    setFormValues({
      shipper: formDetails,
    })
  }, [formDetails])

  const selectOptions = [
    { key: 'choose one', value: null },
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
    },
  }

  const validationSchema = Yup.object({
    shipper: Yup.object().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      address: Yup.string().required(),
      address2: Yup.string().notRequired(),
      address3: Yup.string().notRequired(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      postalCode: Yup.number().required(),
      country: Yup.string().required(),
      cellphone: Yup.string().required(),
      telephone: Yup.string().notRequired(),
    }),
  })

  if (
    customerInfoQueryStatus === 'loading' ||
    formDetailsStatus === 'loading'
  ) {
    return <div>Loading...</div>
  }

  return (
    <section id="deliveryInformation">
      {/* <h1> Delviery Information</h1> */}

      <h3>Shipping Customer Pickup Address</h3>
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
        onSubmit={(values) => {
          console.log('adding order form to store', values)

          saveShipperPickupAddressToCart.mutate({
            userId: session?.user?.id,
            customerId: customerId,
            ...values,
          })

          // handlePage && handlePage('NEXT')
          // console.log('form added', formDetails)
        }}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <>
              <Form className="flex flex-col justify-center">
                <div className="flex flex-row items-center justify-center">
                  <div className="orderform-shipper">
                    <p className="font-bold underline">shipper</p>
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
                </div>
                <button
                  type="submit"
                  disabled={!formik.isValid}
                  // onClick={() => refetchCart()}
                  className={`btn w-auto ${
                    !formik.isValid ? ` bg-red-600` : `bg-green-400`
                  }`}
                >
                  Confirm Pickup Address
                </button>
              </Form>
            </>
          )
        }}
      </Formik>
    </section>
  )
}

export default SenderAddressForm
