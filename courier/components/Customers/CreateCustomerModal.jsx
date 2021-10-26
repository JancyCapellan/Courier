import React from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import { useAuth } from '../../contexts/authContext'

const CreateCustomerModal = ({ show, handleClose, any }) => {
  const showHideClassName = show ? 'd-block' : 'd-none'

  const RegisterCustomer = () => {
    const { register, role } = useAuth()
    const initialValues = {
      id: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      role: '',
      company: '',
      branch_name: '',
      prefered_language: '',
      license_id: '',
      password: '',
      password2: '',
    }

    // RegEx for phone number validation
    const phoneRegExp =
      /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

    // Will recreate formik forms to include less code and better validation.

    // Schema for yup
    const validationSchema = Yup.object({
      first_name: Yup.string()
        .min(2, '*Names must have at least 2 characters')
        .max(100, "*Names can't be longer than 100 characters")
        .required('*First Name is required'),

      middle_name: Yup.string()
        .min(2, '*Names must have at least 2 characters')
        .max(100, "*Names can't be longer than 100 characters"),

      last_name: Yup.string()
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

    const selectOptions = [
      { key: 'Customer', value: 'CUST' },
      { key: 'Admin', value: 'ADMIN' },
      { key: 'Staff', value: 'STAFF' },
      { key: 'Driver', value: 'DRIVE' },
    ]

    const onSubmit = (values) => {
      // only admin can make admin
      if (any && role === 'ADMIN') {
        if (values.password !== values.password2) {
          alert('passwords do not match')
        } else {
          register(values)
          handleClose()
          // console.log(values)
        }
      }

      //staff can make anyone but admin
      if (any && role === 'STAFF') {
        if (values.password !== values.password2) {
          alert('passwords do not match')
        } else {
          register(values)
          handleClose()
          // console.log(values)
        }
      }
    }
    return (
      <div>
        <Formik
          className='registration-form'
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <FormikControl control='input' type='text' label='First Name' name='first_name' />
                <FormikControl control='input' type='text' label='Middle Name' name='middle_name' />
                <FormikControl control='input' type='text' label='Last Name' name='last_name' />
                <FormikControl control='input' type='email' label='email' name='email' />
                {any ? (
                  <FormikControl
                    control='select'
                    label='role'
                    name='role'
                    options={selectOptions}
                  />
                ) : (
                  <FormikControl control='input' label='role' name='role' value='CUST' />
                )}
                <FormikControl control='input' type='text' label='company' name='company' />
                <FormikControl control='input' type='text' label='branch_name' name='branch_name' />
                <FormikControl
                  control='input'
                  type='text'
                  label='prefered_language'
                  name='prefered_language'
                />
                <FormikControl control='input' type='text' label='license_id' name='license_id' />
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
              </Form>
            )
          }}
        </Formik>
      </div>
    )
  }
  return (
    <div className={showHideClassName}>
      <div className='modal-container'>
        <RegisterCustomer />
        <button className='modal-close' onClick={handleClose}>
          close
        </button>
      </div>
    </div>
  )
}

export default CreateCustomerModal
