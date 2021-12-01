import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '../../components/Formik/FormikControl'
import * as Yup from 'yup'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'
import { useRouter } from 'next/router'
import ModalContainer from '../../components/HOC/ModalContainer'

// ! customer account page. dynamic entry from customers table

const AddCustomerAddressForm = ({ show, handleClose, currentUser, edit }) => {
  const showHideClassName = show ? 'd-block' : 'd-none'

  // i set select options default here, but will try to make dynamic
  const initialValues = {
    users_id: `${currentUser.id}`,
    address: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    postal_Code: '',
    country: 'USA',
    cellphone: '',
    telephone: '',
  }

  // Schema for yup
  const validationSchema = Yup.object({})

  const selectOptions = [
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  // useEffect(() => {
  //   console.log('test')
  // }, [])

  const AddCustomerAddress = async (values) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/user/addresses/add/${currentUser.id}`,
        values
      )
      if (res.status === 200) alert('Successfully Added')
      return res
    } catch (err) {
      console.error(err)
      alert('error')
    }
  }
  //  TODO: after submission, new data is not shown in form unless refresh or search is done
  const onSubmit = async (values) => {
    console.log(values)
    const res = await AddCustomerAddress(values)
    handleClose()
    console.log('CUSTOMER ADD VALUES:', res)
  }
  return (
    <div className={showHideClassName}>
      <div className='modal-container'>
        <h2>Add Address</h2>
        <Formik
          className='customer-editor-form'
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <Form>
                <FormikControl control='input' type='text' name='users_id' hidden />
                <FormikControl
                  control='select'
                  label='Country'
                  name='country'
                  options={selectOptions}
                />
                <FormikControl control='input' type='text' label='Address line 1' name='address' />
                <FormikControl control='input' type='text' label='Address line 2' name='address2' />
                <FormikControl control='input' type='text' label='Address line 3' name='address3' />
                <FormikControl control='input' type='text' label='city' name='city' />
                <FormikControl control='input' type='text' label='state' name='state' />
                <FormikControl control='input' type='text' label='postal code' name='postal_code' />
                <FormikControl control='input' type='text' label='cellphone' name='cellphone' />
                <FormikControl control='input' type='text' label='telephone' name='telephone' />
                <button type='submit' disabled={!formik.isValid}>
                  Submit
                </button>
              </Form>
            )
          }}
        </Formik>
        <button className='modal-close' onClick={handleClose}>
          close
        </button>
      </div>
    </div>
  )
}

const EditAddressModal = ({ show, handleClose, address }) => {
  const initialValues = {
    address: address.address,
    address2: address.address2,
    address3: address.address3,
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
    country: address.country,
    cellphone: address.cellphone,
    telephone: address.telephone,
  }

  // Schema for yup
  const validationSchema = Yup.object({})

  const selectOptions = [
    { key: 'UNITED STATES', value: 'USA' },
    { key: 'DOMINICAN REPUBLIC', value: 'DR' },
  ]

  // useEffect(() => {
  //   console.log('test')
  // }, [])

  const updateCustomerAddress = async (values) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/user/addresses/update/${address.address_id}`,
        values
      )
      if (res.status === 200) {
        alert('UPDATED')
      }
      return res
    } catch (err) {
      console.error('update erorr', err)
      // alert('error')
    }
  }
  //  TODO: after submission, new data is not shown in form unless refresh or search is done
  const onSubmit = async (values) => {
    console.log('edit', values)
    const res = await updateCustomerAddress(values)
    handleClose()
    console.log('update response', res)
  }

  return (
    <ModalContainer show={show} handleClose={handleClose}>
      <h2>Edit Address</h2>
      <Formik
        className='customer-editor-form'
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => {
          return (
            <Form>
              {/* <FormikControl
                control='input'
                type='text'
                name='users_id'
                // value={address.users_id}
                hidden
              />
              <FormikControl
                control='input'
                type='text'
                name='address_id'
                // value={address.users_id}
                disabled
              /> */}
              <FormikControl
                control='select'
                label='Country'
                name='country'
                options={selectOptions}
                // value={address.country}
              />
              <FormikControl
                control='input'
                type='text'
                label='Address line 1'
                name='address'
                // value={address.address}
              />
              <FormikControl
                control='input'
                type='text'
                label='Address line 2'
                name='address2'
                // value={address.address2}
              />
              <FormikControl
                control='input'
                type='text'
                label='Address line 3'
                name='address3'
                // value={address.address3}
              />
              <FormikControl
                control='input'
                type='text'
                label='city'
                name='city'
                // value={address.city}
              />
              <FormikControl
                control='input'
                type='text'
                label='state'
                name='state'
                // value={address.state}
              />
              <FormikControl
                control='input'
                type='text'
                label='postal code'
                name='postal_code'
                // value={address.postal_code}
              />
              <FormikControl
                control='input'
                type='text'
                label='cellphone'
                name='cellphone'
                // value={address.cellphone}
              />
              <FormikControl
                control='input'
                type='text'
                label='telephone'
                name='telephone'
                // value={address.telephone}
              />
              <button type='submit' disabled={!formik.isValid}>
                Submit
              </button>
            </Form>
          )
        }}
      </Formik>
    </ModalContainer>
  )
}

const CustomerAddresses = ({ user }) => {
  const [addresses, setAddresses] = useState([])
  const [editAddress, setEditAddress] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)

  const handleModalClose = () => {
    // console.log('close modal')
    setShowModal(false)
    setShowAddressModal(false)
  }

  useEffect(() => {
    async function getCustomerAddress() {
      try {
        let res = await axios.get(`http://localhost:3000/user/addresses/${user.id}`)
        if (res.status === 200) {
          // console.table(res.data)
          setAddresses(res.data)
        }
      } catch (error) {
        console.log('getcustomer', error)
      }
    }
    getCustomerAddress()
  }, [])

  return (
    <>
      <section>
        <h2>Addresses for {`${user.first_name}`}</h2>
        <button onClick={() => setShowModal(true)}>Add Address</button>
        <table>
          <tbody>
            <tr>
              {/* <th>Address ID</th> */}
              <th>Address Line 1</th>
              <th>Address Line 2</th>
              <th>Address Line 3</th>
              <th>City</th>
              <th>State</th>
              <th>Postal Code</th>
              <th>Country</th>
              <th>Cellphone</th>
              <th>Telephone</th>
            </tr>
            {addresses.map((address) => {
              return (
                <tr className='customer-table-row' key={address.address_id}>
                  {/* <td>{address.address_id}</td> */}
                  <td>{address.address}</td>
                  {address.address2 ? <td>{address.address2}</td> : <td>N/A</td>}
                  {address.address3 ? <td>{address.address3}</td> : <td>N/A</td>}
                  <td>{address.city}</td>
                  <td>{address.state}</td>
                  <td>{address.postal_code}</td>
                  <td>{address.country}</td>
                  <td>{address.cellphone}</td>
                  <td>{address.telephone}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditAddress(address)
                        setShowAddressModal(true)
                        console.log(address)
                      }}
                    >
                      edit
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      <AddCustomerAddressForm show={showModal} handleClose={handleModalClose} currentUser={user} />
      <EditAddressModal
        show={showAddressModal}
        handleClose={handleModalClose}
        address={editAddress}
      />
    </>
  )
}

const CustomerEditorForm = ({ currentUser }) => {
  // currentUser = user
  // not all of these values are in the form inputs to hide them from being edited.
  const initialValues = {
    id: `${currentUser.id}`,
    firstName: `${currentUser.firstName}`,
    middleName: `${currentUser.middleName}`,
    lastName: `${currentUser.lastName}`,
    password: `${currentUser.password}`,
    email: `${currentUser.email}`,
    role: `${currentUser.role}`,
    company: `${currentUser.company}`,
    branchName: `${currentUser.branchName}`,
    preferredLanguage: `${currentUser.preferredLanguage}`,
    licenseId: `${currentUser.licenseId}`,
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
      const res = await axios.put(`http://localhost:3000/user/${currentUser.id}`, values)
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
              <FormikControl control='input' type='text' label='Customer ID:' name='id' disabled />
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

const CustomerOrderHistory = ({ currentUser }) => {
  const [orderHistory, setOrderHistory] = useState([])
  useEffect(() => {
    async function getCustomerOrders() {
      try {
        let res = await axios.get(`http://localhost:3000/order/user/${currentUser.id}`)
        if (res.status === 200) {
          console.log('herere', res.data)
          setOrderHistory(res.data.orders)
        }
      } catch (error) {
        console.log('getcustomer', error)
      }
    }
    getCustomerOrders()
  }, [])

  return (
    <>
      <h1>ORDERS</h1>
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
            <th>location</th>
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
                <td>{order.status} </td>
                <td>{order.location}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export const getServerSideProps = async ({ params, res }) => {
  const { user } = params
  try {
    const result = await axios.get(`http://localhost:3000/user/${user}`)
    console.log('response', result.data)
    return {
      props: {
        user: result.data,
      },
    }
  } catch (error) {
    res.statusCode = 500
    console.log('getcustomer', error)
    return {
      props: {},
    }
  }
}

const CustomerAccountPage = ({ user }) => {
  const [currentPage, setCurrentPage] = useState(1)

  function ComponentSwitcher({ currentUser }) {
    switch (currentPage) {
      case 1:
        return <CustomerEditorForm currentUser={currentUser} />
      case 2:
        return <CustomerAddresses user={currentUser} />
      case 3:
        return <CustomerOrderHistory currentUser={currentUser} />
      case 4:
        break
      default:
        return <CustomerEditorForm currentUser={currentUser} />
    }
  }

  return (
    <Sidebar>
      <h2> Customer Account Information</h2>
      <nav>
        <button onClick={() => setCurrentPage(1)}>Customer</button>
        <button onClick={() => setCurrentPage(2)}>Addresses</button>
        <button onClick={() => setCurrentPage(3)}>Order History</button>
        <button>Current Orders</button>
      </nav>
      <br />
      <ComponentSwitcher currentUser={user} />
      <br />
    </Sidebar>
  )
}

export default CustomerAccountPage
