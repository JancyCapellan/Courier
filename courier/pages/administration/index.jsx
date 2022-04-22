import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import RegistrationForm from '../../components/RegistrationForm.jsx'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../components/Formik/FormikControl'

export const getStaticProps = async ({ res }) => {
  try {
    const result = await axios.post(`http://localhost:3000/user/allDrivers`)
    console.log('response', result.data)
    return {
      props: {
        drivers: result.data,
      },
    }
  } catch (error) {
    res.statusCode = 500
    console.log('getdrivers', error)
    return {
      props: {},
    }
  }
}

const Administration = ({ drivers }) => {
  const [branch, setBranch] = useState()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleModalClose = () => setShowModal(false)

  const BranchOfficeData = (branch) => {
    return (
      <section>
        <section></section>
      </section>
    )
  }

  console.log('drivers', drivers)

  function openDriverPage(driverId) {
    console.log('open driver page')
    router.push({
      pathname: `/administration/${driverId}`,
    })
  }

  const Drivertable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>driver name</th>
            <th>packages assigned today</th>
            <th>branch name</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => {
            return (
              <tr onClick={() => openDriverPage(driver.id)} key={driver.id}>
                <td>
                  {driver.firstName} {driver.lastName}
                </td>
                <td></td>
                <td>{driver.branchName}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  const ProductEditorTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>TYPE</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => {
            return (
              <tr key={driver.id}>
                <td>1</td>
                <td>Box</td>
                <td>$75</td>
                <td>Box</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <Sidebar>
      <section className='administration-container'>
        <h1>Staff Manager</h1>
        <ModalContainer show={showModal} handleClose={handleModalClose}>
          <RegistrationForm staff={true} />
        </ModalContainer>

        <button className='btn' onClick={() => setShowModal(true)}>
          Create Staff
        </button>
        <Drivertable />

        <h1>Product manager</h1>
        <section className='product-manager-container'>
          <Formik
            // initialValues={{ email: '', password: '', tenantKey: '' }}
            initialValues={{ item_name: ' ', item_price: 0, item_type: '' }}
            validationSchema={Yup.object({
              item_name: Yup.string()
                .min(3, 'must be at least 3 characters long')
                .required('please enter item name'),
              item_price: Yup.number().required('please enter a price for this item'),
              item_type: Yup.string().required('Please enter item type'),
              // tenantKey: Yup.string()
              //   .max(20, 'Must be 20 characters or less')
              //   .required('Please enter your organization name'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              console.log('item submission values', values)
              try {
                const res = await axios.post('http://localhost:3000/services/addItem', values)
                console.log('REGISTER RES HERE', res)
                return res
              } catch (error) {
                console.log(error)

                return 500
              }
              // setSubmitting(false)
            }}
          >
            {(formik) => {
              return (
                <Form className=''>
                  <FormikControl
                    control='input'
                    type='text'
                    label='Name'
                    name='item_name'
                    className=''
                  />
                  <FormikControl
                    control='input'
                    type='number'
                    label='Price'
                    name='item_price'
                    className=''
                  />
                  <FormikControl
                    control='input'
                    type='text'
                    label='Type'
                    name='item_type'
                    className=''
                  />
                  <button type='submit' disabled={!formik.isValid}>
                    Submit
                  </button>
                </Form>
              )
            }}
          </Formik>
          <div>
            Products list
            <ProductEditorTable />
          </div>
        </section>
      </section>
    </Sidebar>
  )
}

export default Administration
