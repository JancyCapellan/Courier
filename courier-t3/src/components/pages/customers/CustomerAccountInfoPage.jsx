import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import * as Yup from 'yup'
import ModalContainer from '@/components/HOC/ModalContainer'
import { useQueryClient } from 'react-query'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

export const CustomerAccountInfoPage = ({ currentUser }) => {
  // not all of these values are in the form inputs to hide them from being edited.
  const queryClient = useQueryClient()
  const [showEditForm, setShowEditForm] = useState(false)

  const router = useRouter()
  const currentUserID = router.query

  console.log('editor current user', currentUser)

  const initialValues = {
    // id: currentUser?.id,
    firstName: currentUser?.firstName,
    middleName: currentUser?.middleName,
    lastName: currentUser?.lastName,
    // password: currentUser?.password,
    email: currentUser?.email,
    role: currentUser?.role,
    // company: currentUser.company,
    // branchName: currentUser.branchName,
    // licenseId: currentUser.licenseId,
    preferredLanguage: currentUser?.preferredLanguage,
  }

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
    // company: Yup.string(),
    // branchName: Yup.string(),
    // licenseId: Yup.string(),
    preferredLanguage: Yup.string(),
  })

  const mutation = trpc.useMutation(['customers.editUserInformation'], {
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['user.getUserAccountInfo', { userId: currentUser.id }],
        () => {
          return data
        }
      )
      alert('user info edit completed')
    },
  })

  const onSubmit = async (values) => {
    // const res = await postCustomerEdit(values)
    mutation.mutate({ userId: currentUser.id, form: values })
    // alert('completed')
    // console.log('CUSTOMER EDITOR VALUES:', res)
  }

  let user = JSON.stringify(currentUser, undefined, 2)
  return (
    <>
      <button className="btn btn-blue" onClick={() => setShowEditForm(true)}>
        Show Edit Form
      </button>
      <div className="mt-4">
        <table>
          <caption>
            <b>Customer Account Information</b>
          </caption>
          <tbody>
            <tr className="text-red-600">
              <th className="text-red-600">Current Balance</th>
              <td>
                ${(currentUser.currentBalance / 100).toLocaleString('en')}
              </td>
            </tr>
            <tr>
              <th>ID</th>
              <td>{currentUser.id}</td>
            </tr>
            <tr>
              <th>First Name</th>
              <td>{currentUser.firstName}</td>
            </tr>
            <tr>
              <th>Middle Name</th>
              <td>{currentUser.middleName}</td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td>{currentUser.lastName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{currentUser.email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{currentUser.role}</td>
            </tr>
            <tr>
              <th>branch</th>
              <td>{currentUser.branchName}</td>
            </tr>
            <tr>
              <th>Preferred Language</th>
              <td>{currentUser.preferredLanguage}</td>
            </tr>
            <tr>
              <th>License ID</th>
              <td>{currentUser.licenseId}</td>
            </tr>
            {/* <tr>
              <th>Time of Account Creation</th>
              <td>{new Date(currentUser.creationDateTime)}</td>
            </tr> */}
          </tbody>
        </table>
      </div>
      <ModalContainer
        show={showEditForm}
        handleClose={() => setShowEditForm(false)}
      >
        <Formik
          className="customer-editor-form"
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              // TODO FIXME:  Warning: `value` prop on `input` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.
              <Form>
                {/* <FormikControl
                  control='input'
                  type='text'
                  label='Customer ID:'
                  name='id'
                  disabled
                /> */}
                <FormikControl
                  control="input"
                  type="text"
                  label="First Name"
                  name="firstName"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Middle Name"
                  name="middleName"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Last Name"
                  name="lastName"
                />
                <FormikControl
                  control="input"
                  type="email"
                  label="email"
                  name="email"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="role"
                  name="role"
                />
                {/* <FormikControl control='input' type='text' label='company' name='company' />
              <FormikControl control='input' type='text' label='branch name' name='branchName' /> */}
                {/* <FormikControl
                control='input'
                type='text'
                label='License ID Number'
                name='licenseId'
              /> */}
                <FormikControl
                  control="input"
                  type="text"
                  label="preferred language"
                  name="preferredLanguage"
                />
                <button type="submit" disabled={!formik.isValid}>
                  Save Changes
                </button>
              </Form>
            )
          }}
        </Formik>
      </ModalContainer>
    </>
  )
}
