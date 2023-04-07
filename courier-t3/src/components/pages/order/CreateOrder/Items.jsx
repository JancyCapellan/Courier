import React, { useEffect, useState } from 'react'
// import products from '@/components/pages/customers/order/CreateOrder/products.json'
import Item from './item'
import { trpc } from '@/utils/trpc'
import * as Yup from 'yup'
import FormikControl from '@/components/Formik/FormikControl'
import { Formik, Form } from 'formik'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useGlobalStore } from '@/components/globalStore'
// const jsonProdcutsES = products.spanish

const Items = () => {
  const router = useRouter()

  const { data: session, status } = useSession()

  const {
    data: allProducts,
    status: allProductsStatus,
    refetch: refetchProducts,
  } = trpc.useQuery(['public.getProducts'])

  const createProductAtPickup = trpc.useMutation(['cart.createProductAtPickup'])

  const refetchCart = useGlobalStore((state) => state.refetchCart)
  const addToCartSession = trpc.useMutation(['cart.addToCartSession'], {
    onSuccess: () => refetchCart(),
  })

  const addProduct = trpc.useMutation(['products.addProduct'], {
    onSuccess: (data, variables) => {
      // console.log({ data, variables })
      refetchProducts()

      addToCartSession.mutate({
        userId: session?.user?.id,
        customerId: router.query.customerId,
        item: {
          productId: data?.id,
          quantity: variables?.item_amount,
        },
      })
    },
  })

  return (
    <>
      <section>
        <h1> Products</h1>

        <section className="items-section">
          <div className="itemsList">
            {allProductsStatus === 'success' ? (
              allProducts.map((product) => {
                return <Item key={product.id} {...product} />
              })
            ) : (
              <></>
            )}
          </div>
        </section>

        {/* add custom item form */}
        <div className="w-max border-2 border-black">
          <button>Create Misc. Item</button>
          <div>
            <Formik
              initialValues={{
                item_name: ' ',
                item_price: 0,
                item_description: '',
                item_amount: 1,
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
                item_description: Yup.string(),
                item_amount: Yup.number(),
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  console.log('create new product', values)

                  addProduct.mutate({
                    item_name: values.item_name,
                    item_price: values.item_price,
                    item_description: values.item_description,
                    createdOnPickup: true,
                    item_amount: values.item_amount,
                  })
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
                    <FormikControl
                      control="textarea"
                      label="description"
                      name="item_description"
                      className=""
                    />
                    <FormikControl
                      control="input"
                      type="number"
                      label="amount"
                      name="item_amount"
                      className=""
                    />
                    <button
                      className="btn btn-blue"
                      type="submit"
                      disabled={!formik.isValid}
                    >
                      add item
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
