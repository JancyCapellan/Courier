import { Formik, Form } from 'formik'
import FormikControl from './Formik/FormikControl'
import * as Yup from 'yup'
import Link from 'next/link'
import Router from 'next/router'
import { trpc } from '../utils/trpc'

// will create a customer base account, can be upgraded to another role by admins
const RegistrationFormMain = () => {
  const initialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    role: 'CUSTOMER',
  }

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, '*Names must have at least 2 characters')
      .max(100, "*Names can't be longer than 100 characters")
      .required('First Name is required'),

    middleName: Yup.string()
      .min(2, '*Names must have at least 2 characters')
      .max(100, "*Names can't be longer than 100 characters"),

    lastName: Yup.string()
      .min(2, '*Names must have at least 2 characters')
      .max(100, "*Names can't be longer than 100 characters")
      .required('Last Name is required'),

    email: Yup.string()
      .email('*Must be a valid email address')
      .max(100, '*Email must be less than 100 characters')
      .required('Email is required'),

    password: Yup.string().required('* required'),
    password2: Yup.string().required('* required'),
    role: Yup.string().required('Must specifiy role'),
  })

  const postRegisterUser = trpc.useMutation(['user.register'])

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    // console.log('register', values)
    if (values.password !== values.password2) {
      alert('passwords do not match')
      return
    }
    delete values.password2

    postRegisterUser.mutate(values, {
      onSuccess: () =>
        Router.push({
          pathname: '/',
          query: { didRegister: 'Registration Successful, Please Log in' },
        }),
      onError: (error) => {
        console.log('registration error:::', error)
        Router.push({
          pathname: '/',
          query: { didRegister: 'Registartion Failed' },
        })
      },
    })

    // if mutate succesful else
  }

  return (
    <>
      <h1> Registration</h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <FormikControl
                control='input'
                type='text'
                // label='User Role'
                name='role'
                disabled
                hidden
              />
              <FormikControl control='input' type='text' label='First Name' name='firstName' />
              <FormikControl control='input' type='text' label='Middle Name' name='middleName' />
              <FormikControl control='input' type='text' label='Last Name' name='lastName' />
              <FormikControl control='input' type='email' label='Email' name='email' />
              <FormikControl control='input' type='password' label='Password' name='password' />
              <FormikControl
                control='input'
                type='password'
                label='Re-enter Password'
                name='password2'
              />

              <button type='submit' disabled={!formik.isValid}>
                Submit
              </button>
              <div>
                Have an Account Already? <Link href='/'> Login </Link>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default RegistrationFormMain
