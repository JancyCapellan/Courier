import React from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import ModalContainer from '@/components/HOC/ModalContainer'
import * as Yup from 'yup'
import { trpc } from '@/utils/trpc'
import { useQueryClient } from 'react-query'

const SaveDeliveryAddressForm = ({ customerId, show, handleClose }) => {
  const queryClient = useQueryClient()
  const selectOptions = [
    { key: 'choose one', value: '' },
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]
  const initialValues = {
    userId: customerId,
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

  const validationSchema = Yup.object().shape({
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
  const saveDeliveryAddress = trpc.useMutation(['user.addDeliveryAddress'], {
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['user.getDeliveryAddresses', { userId: customerId }],
        (oldData) => {
          if (typeof oldData === 'undefined') return data
          return [data, ...oldData]
        }
      )
      // alert('user address edit completed')
    },
  })

  return (
    <>
      <ModalContainer show={show} handleClose={handleClose}>
        <h2>Add Address</h2>
        <Formik
          className="customer-editor-form"
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            saveDeliveryAddress.mutate({
              userId: customerId,
              addressForm: values,
            })
            handleClose()
          }}
        >
          {(formik) => {
            return (
              <Form>
                <FormikControl
                  control="input"
                  type="text"
                  name="userId"
                  hidden
                />
                <FormikControl
                  control="select"
                  label="Country"
                  name="country"
                  options={selectOptions}
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Address line 1"
                  name="address"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Address line 2"
                  name="address2"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Address line 3"
                  name="address3"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="City"
                  name="city"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="State"
                  name="state"
                />
                <FormikControl
                  control="input"
                  type="number"
                  label="Postal code"
                  name="postalCode"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Cellphone"
                  name="cellphone"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Telephone"
                  name="telephone"
                />
                <button type="submit" disabled={!formik.isValid}>
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

export default SaveDeliveryAddressForm
