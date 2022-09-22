import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../components/Formik/FormikControl'
import { trpc } from '@/utils/trpc'

const ProductEditorTable = () => {
  const {
    data: productTypes,
    status: productTypesStatus,
    refetch: refetchProductTypes,
  } = trpc.useQuery(['public.getAllProductTypes'], {
    onSuccess: (data) => {},
    onError: (error) => {
      console.log('error fetching product types')
    },
    staleTime: Infinity,
  })

  const {
    data: productList,
    status: productListStatus,
    refetch: refetchProductList,
  } = trpc.useQuery(['public.getAllProducts'])

  const deleteType = trpc.useMutation(['staff.deleteProductType'])

  const createProduct = trpc.useMutation(['staff.addProduct'])
  const createProductType = trpc.useMutation(['staff.addProductType'])

  return (
    <>
      {productTypesStatus === 'success' && (
        <div>
          Create New Product
          <Formik
            initialValues={{ item_name: ' ', item_price: 0, item_type: 0 }}
            validationSchema={Yup.object({
              item_name: Yup.string()
                .min(3, 'must be at least 3 characters long')
                .required('please enter item name'),
              item_price: Yup.number().required(
                'please enter a price for this item'
              ),
              item_type: Yup.number()
                .required('Please select the item type')
                .min(1, 'must select a type'),
            })}
            onSubmit={async (values, { resetForm }) => {
              console.log('item submission values', values)

              const intType = parseInt(values.item_type)
              values.item_type = intType
              try {
                createProductType.mutate(values)
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
          initialValues={{ type: '' }}
          validationSchema={Yup.object({
            type: Yup.string(),
          })}
          onSubmit={async (values, { resetForm }) => {
            console.log('item submission values', values)
            try {
              createProductType.mutate(values)

              console.log('added type')

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
                  name='type'
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
                <tr key={type.id}>
                  <td>{type.type}</td>
                  {!!type.type && (
                    <td onClick={() => deleteType.mutate({ typeId: type.id })}>
                      delete
                    </td>
                  )}
                </tr>
              )
            })}
        </tbody>
      </table>
    </>
  )
}

export default ProductEditorTable
