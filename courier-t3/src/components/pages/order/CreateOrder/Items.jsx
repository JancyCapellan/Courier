import React, { useEffect, useState } from 'react'
// import products from '@/components/pages/customers/order/CreateOrder/products.json'
import Item from './item'
import { trpc } from '@/utils/trpc'
import * as Yup from 'yup'
import FormikControl from '@/components/Formik/FormikControl'
import { Formik, Form } from 'formik'
// const jsonProdcutsES = products.spanish

const Items = () => {
  const { data: allProducts, status: allProductsStatus } = trpc.useQuery([
    'public.getAllProducts',
  ])
  return (
    <>
      <section>
        <h1> Products</h1>

        <section className="items-section">
          <div className="itemsList">
            {allProductsStatus === 'success' ? (
              allProducts.map((item) => {
                return <Item key={item.id} {...item} />
              })
            ) : (
              <></>
            )}
          </div>
        </section>
        <div>
          <button>Create Misc. Item</button>
          <div>
            <Formik
              initialValues={{
                item_name: ' ',
                item_price: 0,
                item_description: '',
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
                        let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/
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
        </div>
        {/* <button onClick={() => handlePage('NEXT')}>NEXT</button> */}
      </section>
    </>
  )
}

export default Items
