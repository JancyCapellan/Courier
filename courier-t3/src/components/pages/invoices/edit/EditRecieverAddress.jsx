import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { useSession } from 'next-auth/react'

const EditRecieverAddressForm = ({
  recieverAddress,
  orderId,
  refetchAddress,
}) => {
  const { data: session, status: sessionStatus } = useSession()

  const [formValues, setFormValues] = useState(null)

  useEffect(() => {
    if (!!recieverAddress) setFormValues(recieverAddress)
  }, [formValues, recieverAddress])

  const selectOptions = [
    { key: 'choose one', value: '' },
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  const initialValues = {
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    cellphone: '',
    telephone: '',
  }

  // const initialValues = {
  //   firstName: recieverAdress?.firstName,
  //   lastName: recieverAdress?.lastName,
  //   address: recieverAdress?.address,
  //   address2: recieverAdress?.address2,
  //   address3: recieverAdress?.address3,
  //   city: recieverAdress?.city,
  //   state: recieverAdress?.state,
  //   postalCode: recieverAdress?.postalCode,
  //   country: recieverAdress?.country,
  //   cellphone: recieverAdress?.cellphone,
  //   telephone: recieverAdress?.telephone,
  // }

  const validationSchema = Yup.object({
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
  })

  const updateRecieverAddress = trpc.useMutation(
    ['invoice.updateRecieverAddress'],
    {
      onSuccess: (data) => {
        refetchAddress()
        console.log({ data })
      },
      onError: (e) => {
        console.error(e)
      },
    }
  )

  return (
    <section id="deliveryInformation">
      <h3>Editing Reciever Address (delivery Address)</h3>

      {/* before edit confirm */}
      <div>
        <Formik
          initialValues={formValues || initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log('adding order form to store', values)

            // update order recieveing address

            updateRecieverAddress.mutate({
              orderId: orderId,
              updatedAddress: values,
            })
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
                        name="firstName"
                        type="text"
                      />
                      <FormikControl
                        control="input"
                        label="Last Name"
                        name="lastName"
                        type="text"
                      />
                      <FormikControl
                        control="input"
                        label="reciever Address"
                        name="address"
                        type="text"
                      />
                      <FormikControl
                        control="input"
                        label="reciever Address2"
                        name="address2"
                        type="text"
                      />
                      <FormikControl
                        control="input"
                        label="reciever Address3"
                        name="address3"
                        type="text"
                      />
                      <FormikControl
                        control="input"
                        label="reciever City"
                        name="city"
                        type="text"
                      />
                      <FormikControl
                        control="input"
                        label="reciever State"
                        name="state"
                        type="text"
                      />
                      <FormikControl
                        control="input"
                        type="number"
                        label="reciever Postal Code"
                        name="postalCode"
                      />
                      <FormikControl
                        control="select"
                        label="Country"
                        name="country"
                        type="text"
                        options={selectOptions}
                      />
                      <FormikControl
                        control="input"
                        label="reciever cellphone"
                        name="cellphone"
                        type="text"
                      />
                      <FormikControl
                        control="input"
                        label="reciever telephone"
                        name="telephone"
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
                    Confirm Address Edit
                  </button>
                </Form>
              </>
            )
          }}
        </Formik>
      </div>

      {/* after edit is conirmed show the address without the faorm, give button to open form again for edit */}
    </section>
  )
}

export default EditRecieverAddressForm
