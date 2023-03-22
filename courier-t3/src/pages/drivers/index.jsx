import Layout from '@/components/Layout'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import React from 'react'
// driver logs into app, gets a list of orders for the day
// DRIVER OPENS ORDER TO CONFIRM WITH CUSTOMER, CUSTOMER NEEDS TO ADD/REMOVE ITEMS, CONFIRM ORDER, PRINT INVOVICE RECEIPT WITH OVERALL DETAILS THEN PRINT A TAG FOR EACH PACKAGGE WITH INVOICE ID/ PAKCKAGE NUMBER / CONTENT

const DriverHome = () => {
  const { data: session, status: sessionStatus } = useSession()
  const pickupList = trpc.useQuery(
    ['invoice.getAllDriverOrders', { driverId: session?.user?.id }],
    {
      enabled: sessionStatus === 'authenticated',
    }
  )

  return <div>DriverHome</div>
}

export default DriverHome

DriverHome.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
