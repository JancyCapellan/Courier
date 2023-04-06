import FormikControl from '@/components/Formik/FormikControl'
import { trpc } from '@/utils/trpc'
import { Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const InvoicePaymentForm = ({
  orderId,
  paymentType,
  closeModal,
  refetchPayments,
}) => {
  const initialValues = {
    orderId: orderId,
    amountPaid: 0,
    paymentType: paymentType,
  }

  const validationSchema = Yup.object().shape({
    orderId: Yup.string(),
    amountPaid: Yup.number(),
    paymentType: Yup.string(),
  })

  const makeInvoicePayment = trpc.useMutation(
    ['invoice.createInvoicePayment'],
    {
      onSuccess: () => {
        refetchPayments()
        closeModal()
      },
    }
  )

  return (
    <>
      <h2>Invoice Payment Form</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          makeInvoicePayment.mutate(values)
        }}
      >
        {({ isValid }) => {
          return (
            <Form>
              <FormikControl
                control="input"
                type="number"
                label="Enter Amount to pay: "
                name="amountPaid"
                // max="150"
                min="0"
              />
              <button
                className="btn btn-blue"
                type="submit"
                disabled={!isValid}
              >
                Submit Payment for Confirmation
              </button>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default InvoicePaymentForm
