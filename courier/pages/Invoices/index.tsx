import React, { useState, useEffect, ReactElement, ReactNode } from 'react'
import Sidebar from '../../components/Sidebar'
import { GetServerSideProps, NextPage } from 'next'
import axios from 'axios'
import { useRouter } from 'next/router'
import DateTime from 'luxon'
import Layout from '../../components/Layout'
import PickupListTable from '../../components/Tables/PickupListTable'
import { backendClient } from '../../components/axiosClient.mjs'
import { makeOrder } from '../../components/Tables/makeData.mjs'
import { useQueryClient, useMutation } from 'react-query'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}
interface OrderData {
  id: number
  recieverFirstName: string
  recieverLastName: string
  totalPrice: number
  totalItems: number
  status: string
  location: string
  timePlaced: string
  pickupDriverId: number
  pickupdriver: user
  pickupDatetime: string
  user: user
}

interface user {
  firstName: string
  lastName: string
}

// export const getServerSideProps: GetServerSideProps = async ({ res }) => {
//   try {
//     const result = await axios.get(`http://localhost:3000/order/allOrders`)
//     // console.log('response', result.data)
//     return {
//       props: {
//         listOfInvoices: result.data,
//       },
//     }
//   } catch (error) {
//     res.statusCode = 500
//     console.log('getcustomer', error)
//     return {
//       props: {},
//     }
//   }
// }

export const Invoices: NextPage<{}> = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [currentBranch, setCurrentBranch] = useState<string>('NYC')

  function openInvoice(id: number) {
    router.push({
      pathname: `/Invoices/${id}`,
      // query: { orderId: id },
    })
  }

  async function updateOrderDriver(orderId: number, driverId: number) {
    console.log('updated order', orderId, driverId)

    const result = await axios.put(`http://localhost:3000/order/${orderId}/`, {
      pickupDriverId: driverId,
    })

    console.log('updateOrderDriver', result)
    // router.reload()
  }

  const postAddManyOrders = async () => {
    try {
      const res = await backendClient.post('/order/submitOrder', makeOrder(1)[0])
      console.log(' added orders', res)
      // TODO: do this to avoid refectching all queries, data saver, and time saver potentially for slower devices.
      // queryClient.setQueryData('getAllOrders', res.data) //shapes of api response must be same for submit and get orders
      queryClient.invalidateQueries('getAllOrders')
      return res.data
    } catch (error) {
      console.log('error adding orders', error)
    }
  }

  const mutation = useMutation(postAddManyOrders, {
    // onSuccess: (data) => {
    //   queryClient.setQueryData('getAllOrders', data)
    // },
  })
  // const orderHistory = props.listOfInvoices
  // console.log('list', orderHistory)
  return (
    <Layout>
      <h1>Current ORDERS - {currentBranch}</h1>
      <label>
        Branch Name:
        <select name='branches' onChange={(e) => setCurrentBranch(e.currentTarget.value)}>
          <option key='default'>default branch</option>
          <option key='NYC'>NYC</option>
          <option key='DR'>DR</option>
          <option key='MIAMI'>MIAMI</option>
        </select>
      </label>

      <button
        onClick={() => {
          mutation.mutate()
        }}
      >
        create mock order
      </button>

      {currentBranch ? <PickupListTable /> : <h3> CHOOSE BRANCH </h3>}
    </Layout>
  )
}

export default Invoices

// Invoices.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>
// }
