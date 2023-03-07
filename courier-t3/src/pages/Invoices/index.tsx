import React, { useState, useEffect, ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import PickupListTable from '@/components/Tables/PickupListTable'
import { makeOrder } from '../../components/Tables/makeData.mjs'
import { useQueryClient, useMutation } from 'react-query'

// type NextPageWithLayout = NextPage & {
//   getLayout?: (page: ReactElement) => ReactNode
// }
// interface OrderData {
//   id: number
//   recieverFirstName: string
//   recieverLastName: string
//   totalPrice: number
//   totalItems: number
//   status: string
//   location: string
//   timePlaced: string
//   pickupDriverId: number
//   pickupdriver: user
//   pickupDatetime: string
//   user: user
// }

// interface user {
//   firstName: string
//   lastName: string
// }

export const Invoices: NextPage<{}> = () => {
  // const queryClient = useQueryClient()
  // const router = useRouter()
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
