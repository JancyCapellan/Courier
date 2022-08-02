import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import ModalContainer from '../../components/HOC/ModalContainer'
import Layout from '../../components/Layout'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { backendClient } from '../../components/axiosClient.mjs'
import UserAddressesTable from '../../components/Customers/[userId]/UserAddressesTable'
import AddCustomerAddressForm from '../../components/Customers/AddCustomerAddressForm'

const CustomerAddresses = ({ currentUser }) => {
  // const [editAddress, setEditAddress] = useState({})
  const [showModal, setShowModal] = useState(false)
  // const [showAddressModal, setShowAddressModal] = useState(false)
  // const [showEditModal, setOpenEditModal] = useState(false)

  console.log('cu', currentUser)
  return (
    <>
      <section>
        <h2>
          Addresses for {`${currentUser.firstName}`} {`${currentUser.lastName}`}
        </h2>
        <button onClick={() => setShowModal(true)}>Add Address</button>
        <UserAddressesTable userId={currentUser.id} />
      </section>

      <AddCustomerAddressForm
        show={showModal}
        handleClose={() => {
          setShowModal(false)
        }}
      />
    </>
  )
}

const CustomerOrderHistory = ({ currentUser }) => {
  const router = useRouter()
  const getUserOrders = async () => {
    const { data } = await backendClient.get(`/order/userOrder/${currentUser.id}`)
    return data
  }

  const { data: orderHistory, status: userOrderStatus } = useQuery(
    ['getUserOrders', currentUser.id],
    () => getUserOrders()
  )

  console.log('user order History', orderHistory)
  return (
    <>
      <h1>ORDERS</h1>
      {userOrderStatus === 'success' ? (
        <table>
          <caption>User Order History</caption>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>time placed</th>
              <th>Sending to:</th>
              <th>total cost</th>
              <th>total items</th>
              <th>status</th>
              {/* <th>location</th> */}
              <th>utilities</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order) => {
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.timePlaced}</td>
                  <td>
                    {order.recieverFirstName} {order.recieverLastName}
                  </td>
                  <td>{order.totalPrice}</td>
                  <td>{order.totalItems}</td>
                  <td>{order.status.message} </td>
                  {/* <td>{order.location}</td> */}
                  <td>
                    <button
                      onClick={() =>
                        router.push({
                          pathname: `/Invoices/${order.id}`,
                          // query: { orderId: id },
                        })
                      }
                    >
                      invoice page
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <>
          <p>order history is loading</p>
        </>
      )}
    </>
  )
}

const CustomerEditorForm = ({ currentUser }) => {
  // not all of these values are in the form inputs to hide them from being edited.
  const queryClient = useQueryClient()
  const [showEditForm, setShowEditForm] = useState(false)

  console.log('editor current user', currentUser)

  const initialValues = {
    id: currentUser.id,
    firstName: currentUser.firstName,
    middleName: currentUser.middleName,
    lastName: currentUser.lastName,
    password: currentUser.password,
    email: currentUser.email,
    role: currentUser.role,
    // company: currentUser.company,
    // branchName: currentUser.branchName,
    // licenseId: currentUser.licenseId,
    preferredLanguage: currentUser.preferredLanguage,
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

  const postCustomerEdit = async (values) => {
    try {
      const { data } = await backendClient.put('user/' + currentUser.id, values)
      return data
    } catch (err) {
      alert('error')
      console.error(err)
    }
  }

  const mutation = useMutation(postCustomerEdit, {
    onSuccess: (data) => {
      queryClient.setQueryData(['getUserAccountInfo', currentUser.id], () => {
        return data
      })
      alert('user info edit completed')
    },
  })

  const onSubmit = async (values) => {
    // const res = await postCustomerEdit(values)
    mutation.mutate(values)
    // alert('completed')
    // console.log('CUSTOMER EDITOR VALUES:', res)
  }

  let user = JSON.stringify(currentUser, undefined, 2)
  return (
    <>
      <button onClick={() => setShowEditForm(true)}>Show Edit Form</button>
      <div>
        <h2>User Account Info</h2>
        <pre>{user}</pre>
      </div>
      <ModalContainer show={showEditForm} handleClose={() => setShowEditForm(false)}>
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
                {/* <FormikControl control='input' type='text' label='company' name='company' />
              <FormikControl control='input' type='text' label='branch name' name='branchName' /> */}
                {/* <FormikControl
                control='input'
                type='text'
                label='License ID Number'
                name='licenseId'
              /> */}
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
      </ModalContainer>
    </>
  )
}

const CustomerAccountPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const [currentPage, setCurrentPage] = useState(1)

  const getUserAccountInfo = async (userId) => {
    try {
      const { data } = await backendClient.get(`/user/${userId}`)
      return data
    } catch (error) {
      console.log('getcustomer', error)
    }
  }

  const { data: user, status: getUserAccountInfoStatus } = useQuery(
    ['getUserAccountInfo', userId],
    () => getUserAccountInfo(userId)
  )

  //    try {
  //    const data = await queryClient.fetchQuery(queryKey, queryFn)
  //  } catch (error) {
  //    console.log(error)
  //  }

  console.log('current User', user)

  function ComponentSwitcher({ user }) {
    switch (currentPage) {
      case 1:
        return <CustomerEditorForm currentUser={user} />
      case 2:
        return <CustomerAddresses currentUser={user} />
      case 3:
        return <CustomerOrderHistory currentUser={user} />
      default:
        return <CustomerEditorForm currentUser={user} />
    }
  }

  return (
    <>
      <h2> Customer Account Information</h2>
      <nav>
        <button onClick={() => setCurrentPage(1)}>Account Information</button>
        <button onClick={() => setCurrentPage(2)}>Addresses</button>
        <button onClick={() => setCurrentPage(3)}>Order History</button>
      </nav>
      <br />
      {getUserAccountInfoStatus === 'success' ? <ComponentSwitcher user={user} /> : <></>}
      <br />
    </>
  )
}

export default CustomerAccountPage

CustomerAccountPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
