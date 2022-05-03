import { useState } from 'react'
// import Sidebar from '../../components/Sidebar'
import RegistrationForm from '../../components/RegistrationForm.jsx'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../components/Formik/FormikControl'
import Layout from '../../components/Layout'
import { useQuery } from 'react-query'

const Administration = () => {
  const [branch, setBranch] = useState()
  const [showModal, setShowModal] = useState(false)
  // const [drivers, setDrivers] = useState([])
  const router = useRouter()

  const handleModalClose = () => setShowModal(false)

  function openDriverPage(driverId) {
    console.log('open driver page')
    router.push({
      pathname: `/administration/${driverId}`,
    })
  }

  const Drivertable = () => {
    const getDrivers = async () => {
      const { data } = await axios.post(`http://localhost:3000/user/allDrivers`)
      console.log('DRIVERS DATA', data)
      return data
    }
    let { data: drivers, status } = useQuery('getDrivers', getDrivers, {
      onSuccess: (data) => {
        console.log('drivers', data)
      },
      onError: (error) => {
        console.log('error fetching product types', error)
      },
      staleTime: Infinity,
    })

    return (
      <>
        {status === 'loading' && <div>loading</div>}
        {status === 'success' && (
          <table>
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Packages Assigned Today</th>
                <th>Affliated Branch</th>
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
        )}
      </>
    )
  }

  const ProductEditorTable = () => {
    const [selectOptions, setSelectOptions] = useState([{ key: 'select type', value: 0 }])

    const getProductList = async () => {
      const { data } = await axios.get(`http://localhost:3000/order/allProducts`)
      return data
    }
    const getProductTypes = async () => {
      const { data } = await axios.get('http://localhost:3000/services/productTypes')
      console.log('product types', data)
      return data
    }
    const { data: productTypes } = useQuery('productTypes', getProductTypes, {
      onSuccess: (data) => {
        data.forEach((type) =>
          setSelectOptions((selectOptions) => [
            ...selectOptions,
            { key: `${type.type}`, value: type.id },
          ])
        )
      },
      onError: (error) => {
        console.log('error fetching product types')
      },
      staleTime: Infinity,
    })

    const { data: productList, status: productListStatus } = useQuery(
      'productList',
      getProductList,
      {}
    )

    return (
      <>
        <Formik
          // initialValues={{ email: '', password: '', tenantKey: '' }}
          initialValues={{ item_name: ' ', item_price: 0, item_type: 0 }}
          validationSchema={Yup.object({
            item_name: Yup.string()
              .min(3, 'must be at least 3 characters long')
              .required('please enter item name'),
            item_price: Yup.number().required('please enter a price for this item'),
            // not correctly working for select field
            item_type: Yup.number()
              .required('Please select the item type')
              .min(1, 'must select a type'),
            // tenantKey: Yup.string()
            //   .max(20, 'Must be 20 characters or less')
            //   .required('Please enter your organization name'),
          })}
          onSubmit={async (values, { resetForm }) => {
            console.log('item submission values', values)
            const intType = parseInt(values.item_type)
            values.item_type = intType
            try {
              const res = await axios.post('http://localhost:3000/services/addItem', values)
              console.log('add item res', res)
              alert('added item successfully')
              resetForm()
              return res
            } catch (error) {
              // console.log(error)
              alert('error adding item. please make sure type is selected')
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
                  control='select'
                  options={selectOptions}
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
            {productListStatus === 'success' &&
              productList.map((product) => {
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.type}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </>
    )
  }

  return (
    <>
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
          <ProductEditorTable />
        </section>
      </section>
    </>
  )
}

export default Administration

Administration.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
