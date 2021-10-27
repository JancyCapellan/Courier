import { Formik, Form, FormikContextType } from 'formik'
import FormikControl from './Formik/FormikControl'
import * as Yup from 'yup'
import { useAuth } from '../contexts/authContext'
import Link from 'next/link'
import Router from 'next/router'

const RegistrationForm = (type: any) => {
  const { register } = useAuth()
  const initialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    role: 'admin',
  }

  // RegEx for phone number validation
  const phoneRegExp =
    /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

  // Will recreate formik forms to include less code and better validation.

  // Schema for yup
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

  const onSubmit = (values: any) => {
    setTimeout(() => {
      if (values.password !== values.password2) {
        alert('passwords do not match')
      } else {
        if (register(values)) Router.push('/home')
        // console.log(values)
      }
    }, 1000)
  }
  return (
    <div>
      <h1> Reigstraion Form </h1>
      <Formik
        className='registration-form'
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <FormikControl control='input' type='text' label='First Name' name='firstName' />
              <FormikControl
                control='input'
                type='text'
                label='Middle Name'
                name='middleName'
              />
              <FormikControl control='input' type='text' label='Last Name' name='lastName' />
              <FormikControl control='input' type='email' label='Email' name='email' />
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

export default RegistrationForm
