import CreateCustomerOrder from '../components/CreateOrder/CreateCustomerOrder'
import React, { useState, useEffect, useRef } from 'react'
import { GetServerSideProps, NextPage } from 'next'

import { useCart } from '../contexts/cartContext'
// import { useHistory } from 'react-router'
import { Formik, Form } from 'formik'
import FormikControl from '../components/Formik/FormikControl'
import * as Yup from 'yup'
import axios from 'axios'
import SelectShipperAddress from '../components/CreateOrder/selectShipperAddress'
import Sidebar from '../components/Sidebar'

export const getServerSideProps = async ({ res }) => {
  try {
    const result = await axios.get(`http://localhost:3000/order/allProducts`)
    return {
      props: {
        products: result.data,
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

const Order = ({ products }) => {
  console.log('prodcuts', products)
  return (
    <section>
      <CreateCustomerOrder products={products} />
    </section>
  )
}
export default Order
