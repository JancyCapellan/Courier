import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import Axios from 'axios'
import Sidebar from '../../components/Sidebar'
import CustomerAddresses from './CustomerAddresses'

const CustomerAccountPage = (props) => {
  const [currentPage, setCurrentPage] = useState(1)
  const stateFromParent = props.location.state
  const currentUser = stateFromParent.user

  function ComponentSwitcher({ currentUser }) {
    switch (currentPage) {
      case 1:
        return <CustomerEditorForm currentUser={currentUser} />
      case 2:
        return <CustomerAddresses user={currentUser} />
      case 3:
        break
      case 4:
        break
      default:
        return <CustomerEditorForm currentUser={currentUser} />
    }
  }
  const CustomerEditorForm = ({ currentUser }) => {
    // currentUser = user
    // not all of these values are in the form inputs to hide them from being edited.
    const initialValues = {
      id: `${currentUser.id}`,
      firstName: `${currentUser.first_name}`,
      middleName: `${currentUser.middle_name}`,
      lastName: `${currentUser.last_name}`,
      password: `${currentUser.password}`,
      email: `${currentUser.email}`,
      role: `${currentUser.role}`,
      company: `${currentUser.company}`,
      branchName: `${currentUser.branch_name}`,
      preferredLanguage: `${currentUser.prefered_language}`,
      licenseId: `${currentUser.license_id}`,
    }

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

      role: Yup.string(),
      company: Yup.string(),
      branchName: Yup.string(),
      preferredLanguage: Yup.string(),
      licenseId: Yup.string(),
    })

    const postCustomerEdit = async (values) => {
      try {
        values.id = parseInt(values.id)
        values.licenseId = parseInt(values.licenseId)
        const res = await Axios.put(`http://localhost:5000/user/${currentUser.id}`, values)
        alert('completed')
        return res
      } catch (err) {
        alert('error')
        console.error(err)
      }
    }
    //  TODO: after submission, new data is not shown in form unless refresh or search is done
    const onSubmit = async (values) => {
      const res = await postCustomerEdit(values)
      // alert('completed')
      console.log('CUSTOMER EDITOR VALUES:', res)
    }
    return (
      <>
        <Formik
          className='customer-editor-form'
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
                  label='Customer ID:'
                  name='id'
                  disabled
                />
                <FormikControl control='input' type='text' label='First Name' name='firstName' />
                <FormikControl control='input' type='text' label='Middle Name' name='middleName' />
                <FormikControl control='input' type='text' label='Last Name' name='lastName' />
                <FormikControl control='input' type='email' label='email' name='email' />
                <FormikControl control='input' type='text' label='role' name='role' />
                <FormikControl control='input' type='text' label='company' name='company' />
                <FormikControl control='input' type='text' label='branch name' name='branchName' />
                <FormikControl
                  control='input'
                  type='text'
                  label='License ID Number'
                  name='licenseId'
                />
                <FormikControl
                  control='input'
                  type='text'
                  label='preferred language'
                  name='preferredLanguage'
                />
                <button type='submit' disabled={!formik.isValid}>
                  Save Changes
                </button>
              </Form>
            )
          }}
        </Formik>
      </>
    )
  }

  return (
    <Sidebar>
      <h2> Customer Account Information</h2>
      <nav>
        <button onClick={() => setCurrentPage(1)}>Customer</button>
        <button onClick={() => setCurrentPage(2)}>Addresses</button>
        <button>Order History</button>
        <button>Current Orders</button>
      </nav>
      <br />
      <ComponentSwitcher currentUser={currentUser} />
      <br />
    </Sidebar>
  )
}

export default CustomerAccountPage
