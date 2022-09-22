import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import * as Yup from 'yup'
import Link from 'next/link'
import { useMutation, useQueryClient } from 'react-query'
// import { backendClient } from './axiosClient.mjs'
import { trpc } from '@/utils/trpc'
import { useGlobalStore } from './globalStore'

const RegistrationFormModal = ({ isRegisteringStaff, closeModal, query }) => {
  const queryClient = useQueryClient()

  const raisedQuery = useGlobalStore((state) => state.queryToRaise)

  const initialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    role: 'CUSTOMER',
  }

  const selectOptions = [
    { key: 'Admin', value: 'ADMIN' },
    { key: 'Staff', value: 'STAFF' },
    { key: 'Driver', value: 'DRIVER' },
  ]

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, '*Names must have at least 2 characters')
      .max(100, "*Names can't be longer than 100 characters")
      .required('*First Name is required'),

    middleName: Yup.string()
      .min(2, '*Names must have at least 2 characters')
      .max(100, "*Names can't be longer than 100 characters"),

    lastName: Yup.string()
      .min(2, '*Names must have at least 2 characters')
      .max(100, "*Names can't be longer than 100 characters")
      .required('*Last Name is required'),

    email: Yup.string()
      .email('*Must be a valid email address')
      .max(100, '*Email must be less than 100 characters')
      .required('*Email is required'),

    password: Yup.string().required('* required'),
    password2: Yup.string().required('* required'),
  })

  const postRegisterUser = trpc.useMutation(['public.register'], {
    onSuccess: (data) => {
      // console.log('data', query)
      {
        isRegisteringStaff === false &&
          queryClient.setQueryData(query, (oldData) => {
            console.log('olddata', oldData, query, data)
            alert('successfully registered customer')

            return {
              customerTableCount: oldData.customerTableCount + 1,
              currentCustomerPage: [
                ...oldData.currentCustomerPage,
                data.registrationSuccessful,
              ],
            }
          })
      }
      {
        isRegisteringStaff === true &&
          queryClient.setQueryData(raisedQuery, (oldData) => {
            return {
              drivers: [...oldData.drivers, data.registrationSuccessful],
              driversTotalCount: oldData.driversTotalCount + 1,
            }
          })
      }
    },
    onError: (error) => alert(error),
  })
  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    if (values.password !== values.password2) {
      alert('passwords do not match')
      return
    }
    console.log('register', values)
    postRegisterUser.mutate(values)
    // handleClose && handleClose()
    closeModal()
  }

  return (
    <div>
      {isRegisteringStaff ? (
        <h1>Create Staff Account</h1>
      ) : (
        <h1> Customer Reigstraion</h1>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <FormikControl
                control='input'
                type='text'
                label='First Name'
                name='firstName'
              />
              <FormikControl
                control='input'
                type='text'
                label='Middle Name'
                name='middleName'
              />
              <FormikControl
                control='input'
                type='text'
                label='Last Name'
                name='lastName'
              />
              <FormikControl
                control='input'
                type='email'
                label='Email'
                name='email'
              />
              <FormikControl
                control='input'
                type='password'
                label='Password'
                name='password'
              />
              <FormikControl
                control='input'
                type='password'
                label='Re-enter Password'
                name='password2'
              />
              {isRegisteringStaff ? (
                <FormikControl
                  control='select'
                  label='role'
                  name='role'
                  options={selectOptions}
                />
              ) : (
                <></>
              )}
              <button type='submit' disabled={!formik.isValid}>
                Submit
              </button>
            </Form>
          )
        }}
      </Formik>
      <div>
        Have an Account Already? <Link href='/'> Login </Link>
      </div>
    </div>
  )
}

export default RegistrationFormModal
