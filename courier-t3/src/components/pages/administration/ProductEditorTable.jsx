import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../components/Formik/FormikControl'
import { trpc } from '@/utils/trpc'

const ProductEditorTable = () => {
  const {
    data: productList,
    status: productListStatus,
    refetch: refetchProductList,
  } = trpc.useQuery(['public.getAllProducts'])

  const createProduct = trpc.useMutation(['products.addProduct'], {
    onSuccess: async (data) => {
      console.log(
        '🚀 ~ file: ProductEditorTable.jsx ~ line 38 ~ onSuccess: ~ data',
        data
      )
      refetchProductList()
    },
  })

  if (productListStatus === 'loading') return <div>Loading...</div>
  let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/
  return (
    <>
      <div>
        Create New Product
        <Formik
          initialValues={{
            item_name: ' ',
            item_price: 0,
          }}
          validationSchema={Yup.object({
            item_name: Yup.string()
              .min(3, 'must be at least 3 characters long')
              .required('please enter item name'),
            item_price: Yup.number()
              .positive()
              .test(
                'is-decimal',
                'The amount should be a decimal with maximum two digits after comma',
                (val) => {
                  if (val != undefined) {
                    return patternTwoDigisAfterComma.test(val)
                  }
                  return true
                }
              )
              .required('please enter a price for this item'),
          })}
          onSubmit={async (values, { resetForm }) => {
            console.log('item submission values', values)

            try {
              console.log('create new product', values)
              createProduct.mutate(values)
              resetForm()
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
              <Form className="">
                <FormikControl
                  control="input"
                  type="text"
                  label="Name"
                  name="item_name"
                  className=""
                />
                <FormikControl
                  control="input"
                  type="number"
                  label="Price"
                  name="item_price"
                  className=""
                />
                <button
                  className="btn btn-blue"
                  type="submit"
                  disabled={!formik.isValid}
                >
                  Submit
                </button>
              </Form>
            )
          }}
        </Formik>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
          </tr>
        </thead>
        <tbody>
          {productListStatus === 'success' &&
            productList.map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${Number(product.price / 100).toLocaleString('en')}</td>
                  {/* // TODO: dynamic locale maybe  */}
                  {/* <td>{product.productType.type}</td> */}
                </tr>
              )
            })}
        </tbody>
      </table>
    </>
  )
}

export default ProductEditorTable
