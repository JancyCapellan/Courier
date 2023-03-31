import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import SelectCustomerAddressesModal from '../selectCustomerAddressesModal'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { useSession } from 'next-auth/react'
import SelectDeliveryAddress from '../SelectDeliveryAddress'

const RecieverAddressForm = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedRecieverAddress, setSelectedRecieverAddress] = useState({
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

  const { data: session, status: sessionStatus } = useSession()

  const router = useRouter()
  const customerId = router.query.customerId
  const { data: currentCustomer, status: customerInfoQueryStatus } =
    trpc.useQuery(['user.getUserAccountInfo', { userId: customerId }])

  const saveRecieverDeliveryAddressToCart = trpc.useMutation([
    'cart.saveRecieverDeliveryAddressToCart',
  ])

  const [formValues, setFormValues] = useState(null)
  const {
    data: formDetails,
    status: formDetailsStatus,
    // refetch: refetchCartAddresses,
  } = trpc.useQuery(
    [
      'cart.getRecieverAddressFromCart',
      { userId: session?.user?.id, customerId: customerId },
    ],
    {
      enabled: sessionStatus === 'authenticated',
    }
  )

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
      reciever: formDetails,
    })
  }, [formDetails])

  const selectOptions = [
    { key: 'choose one', value: '' },
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  const initialValues = {
    reciever: {
      firstName: '',
      lastName: '',
      address: selectedRecieverAddress.address,
      address2: selectedRecieverAddress.address2,
      address3: selectedRecieverAddress.address3,
      city: selectedRecieverAddress.city,
      state: selectedRecieverAddress.state,
      postalCode: selectedRecieverAddress.postalCode,
      country: selectedRecieverAddress.country,
      cellphone: selectedRecieverAddress.cellphone,
      telephone: selectedRecieverAddress.telephone,
    },
  }

  const validationSchema = Yup.object({
    reciever: Yup.object().shape({
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

  if (customerInfoQueryStatus === 'loading' || formDetailsStatus === 'loading')
    return <div>Loading...</div>

  return (
    <section id="deliveryInformation">
      {/* <h1> Delviery Information</h1> */}

      <h3>Recieving party delivery Address</h3>
      <button className="btn btn-blue" onClick={() => setShowModal(true)}>
        select delivery address
      </button>
      <SelectDeliveryAddress
        show={showModal}
        handleClose={() => {
          setShowModal(false)
        }}
        setAddress={setSelectedRecieverAddress}
        currentCustomer={currentCustomer}
      />

      {/* <p>selected address: {selectedRecieverAddress.address}</p> */}
      <Formik
        initialValues={formValues || initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('adding order form to store', values)

          saveRecieverDeliveryAddressToCart.mutate({
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
                  <div className="orderform-reciever">
                    <p className="font-bold underline">Reciever</p>
                    {/* <FormikControl
                  control='select'
                  name='selectRecieverAddress'
                  type="text"
                  options={selectOptions}
                /> */}
                    <FormikControl
                      control="input"
                      label="First Name"
                      name="reciever.firstName"
                      type="text"
                    />
                    <FormikControl
                      control="input"
                      label="Last Name"
                      name="reciever.lastName"
                      type="text"
                    />
                    <FormikControl
                      control="input"
                      label="reciever Address"
                      name="reciever.address"
                      type="text"
                    />
                    <FormikControl
                      control="input"
                      label="reciever Address2"
                      name="reciever.address2"
                      type="text"
                    />
                    <FormikControl
                      control="input"
                      label="reciever Address3"
                      name="reciever.address3"
                      type="text"
                    />
                    <FormikControl
                      control="input"
                      label="reciever City"
                      name="reciever.city"
                      type="text"
                    />
                    <FormikControl
                      control="input"
                      label="reciever State"
                      name="reciever.state"
                      type="text"
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
                      type="text"
                      options={selectOptions}
                    />
                    <FormikControl
                      control="input"
                      label="reciever cellphone"
                      name="reciever.cellphone"
                      type="text"
                    />
                    <FormikControl
                      control="input"
                      label="reciever telephone"
                      name="reciever.telephone"
                      type="text"
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
                  Confirm Delivery Address
                </button>
              </Form>
            </>
          )
        }}
      </Formik>
    </section>
  )
}

export default RecieverAddressForm
