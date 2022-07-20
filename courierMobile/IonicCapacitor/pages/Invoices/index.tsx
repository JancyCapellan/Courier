import React, { useState, useEffect, ReactElement, ReactNode } from 'react'
import Sidebar from '../../components/Sidebar'
import { GetServerSideProps, NextPage } from 'next'
import axios from 'axios'
import { useRouter } from 'next/router'
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
  // const [currentBranch, setCurrentBranch] = useState<string>('NYC')

  // const orderHistory = props.listOfInvoices
  // console.log('list', orderHistory)
  return (
    <Layout>
      <h1>Current ORDERS</h1>
      {/* <label>
        Branch Name:
        <select name='branches' onChange={(e) => setCurrentBranch(e.currentTarget.value)}>
          <option key='default'>default branch</option>
          <option key='NYC'>NYC</option>
          <option key='DR'>DR</option>
          <option key='MIAMI'>MIAMI</option>
        </select>
      </label> */}

      <PickupListTable />
    </Layout>
  )
}

export default Invoices

// Invoices.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>
// }
