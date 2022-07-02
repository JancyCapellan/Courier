import axios from 'axios'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../components/Formik/FormikControl'
import { useQuery, useMutation } from 'react-query'
import { backendClient } from '../../axiosClient.mjs'

const ProductEditorTable = () => {
  const getProductTypes = async () => {
    const { data } = await backendClient.get('services/productTypes')
    return data
  }
  const {
    data: productTypes,
    status: productTypesStatus,
    refetch: refetchProductTypes,
  } = useQuery('productTypes', getProductTypes, {
    onSuccess: (data) => {},
    onError: (error) => {
      console.log('error fetching product types')
    },
    staleTime: Infinity,
  })

  const getProductList = async () => {
    const { data } = await backendClient.get(`services/allProducts`)
    return data
  }
  const {
    data: productList,
    status: productListStatus,
    refetch: refetchProductList,
  } = useQuery('productList', getProductList)

  //react query to delete product type
  const deleteProductType = async (typeId) => {
    const res = await backendClient
      .delete(`services/deleteProductType/${typeId}`)
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log('error reponse')
          alert(error.response.data)
          console.log(error.response.status)
          // console.log(error.response.headers)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message)
        }
        // console.log(error.config)
      })
    // refetchProductTypes()
    // return res.data
  }

  return (
    <>
      {productTypesStatus === 'success' && (
        <div>
          Create New Product
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
                // alert('added item successfully')
                resetForm()
                // router.push('/administration')
                refetchProductList()
                // return res
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
                    options={productTypes}
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
        </div>
      )}

      <div>
        Create Product Type
        <Formik
          initialValues={{ new_type: '' }}
          validationSchema={Yup.object({
            type: Yup.string(),
          })}
          onSubmit={async (values, { resetForm }) => {
            console.log('item submission values', values)
            try {
              const res = await axios.post('http://localhost:3000/services/addProductType', values)
              // alert('added type successfully')
              // router.push('/administration')
              resetForm()
              refetchProductTypes()
            } catch (error) {
              // console.log(error)
              alert('error adding type. ')
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
                  name='new_type'
                  className=''
                />
                <button type='submit' disabled={!formik.isValid}>
                  Submit
                </button>
              </Form>
            )
          }}
        </Formik>
      </div>

      {/* prodcuts table */}
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
                  <td>{product.productType.type}</td>
                </tr>
              )
            })}
        </tbody>
      </table>

      {/* types table */}
      <table>
        <thead>
          <tr>
            <th>TYPES</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {productTypesStatus === 'success' &&
            productTypes.map((type) => {
              return (
                //  value is type_id, key is type_type in DATABASE, changed to match form
                <tr key={type.value}>
                  <td>{type.key}</td>
                  {!!type.value && <td onClick={() => deleteProductType(type.value)}>delete</td>}
                </tr>
              )
            })}
        </tbody>
      </table>
    </>
  )
}

export default ProductEditorTable
