import { Formik, Form, FormikContextType } from 'formik'
import FormikControl from './Formik/FormikControl'
import * as Yup from 'yup'
import Link from 'next/link'
import Router from 'next/router'
import { useEffect } from 'react'
import axios from 'axios'

const register = async (form) => {
  const postRegistration = async () => {
    try {
      delete form.password2
      const res = await axios.post('http://localhost:3000/user/register', form)
      console.log('REGISTER RES HERE', res)
      return res
    } catch (error) {
      console.log(error)

      return 500
    }
  }

  console.log('Registeration form', form)
  const res = await postRegistration(form)
  console.log('REGISTRATION', res)
  switch (res.status) {
    case 200:
      alert('registration completed')
      return true

    case 204:
      alert('ERROR WHILE COMPLETING REGISTRATION')
      return false

    case 500:
      alert('ERROR WHILE REGISTRATING')
      return false

    default:
      throw new Error('res code not 200 or 204')
  }
}

const RegistrationForm = ({ staff, customer = false }) => {
  // useEffect(() => {
  //   console.log('staff', staff, 'customer', customer)
  // }, [])

  const initialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    role: 'CUST',
  }

  const selectOptions = [
    { key: 'Admin', value: 'ADMIN' },
    { key: 'Staff', value: 'STAFF' },
    { key: 'Driver', value: 'DRIVE' },
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

  const onSubmit = async (values) => {
    setTimeout(() => {
      if (values.password !== values.password2) {
        alert('passwords do not match')
      } else {
        if (register(values)) {
          customer ? Router.reload() : staff ? Router.push('/customers') : Router.push('/')
        }
        // console.log(values)
      }
    }, 1000)
  }
  return (
    <div>
      {staff ? <h1>Create Staff Account</h1> : <h1> Reigstraion</h1>}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
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
              {staff ? (
                <FormikControl control='select' label='role' name='role' options={selectOptions} />
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

export default RegistrationForm
