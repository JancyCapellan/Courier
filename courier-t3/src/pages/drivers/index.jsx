import Layout from '@/components/Layout'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import StaffTable from '@/components/pages/administration/StaffTable'
import DateTimeFormat from '@/components/DateTimeFormat'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
// driver logs into app, gets a list of orders for the day
// DRIVER OPENS ORDER TO CONFIRM WITH CUSTOMER, CUSTOMER NEEDS TO ADD/REMOVE ITEMS, CONFIRM ORDER, PRINT INVOVICE RECEIPT WITH OVERALL DETAILS THEN PRINT A TAG FOR EACH PACKAGGE WITH INVOICE ID/ PAKCKAGE NUMBER / CONTENT

const DriverHome = () => {
  const { data: session, status: sessionStatus } = useSession()

  const router = useRouter()
  // const pickupList = trpc.useQuery(
  //   ['invoice.getAllDriverOrders', { driverId: session?.user?.id }],
  //   {
  //     enabled: sessionStatus === 'authenticated',
  //   }
  // )

  const [selectDate, setselectDate] = useState(dayjs().format('YYYY-MM-DD'))

  const { data: pickups, status: getPickupStatus } = trpc.useQuery(
    [
      'staff.getDriverOrders',
      { driverId: session?.user?.id, pickupDate: selectDate },
    ],
    {
      enabled: sessionStatus === 'authenticated',
      onSuccess: (data) => {
        // console.log('account page:', data)
      },
      onError: (error) => {
        console.log('error fetching product types', error)
      },
    }
  )

  return (
    <>
      <input
        className="w-min"
        type="date"
        onChange={(e) => {
          // console.log(e.target.value)
          // let time = e
          let date = e.target.value
          // date = dayjs(date)
          // console.log(date)
          setselectDate(date)
          // let time = e.target.value + ':00.000Z'
          // setPotentialPickupDateTime(time)
        }}
        value={selectDate}
      />
      {getPickupStatus === 'success' && (
        <section className="driverAccountPage">
          <h1>
            {`${session?.user?.role}`}: {session?.user?.name}
          </h1>
          <button
            onClick={() =>
              router.push({
                pathname: `/customers/${session.user?.id}`,
              })
            }
          >
            Edit {`${session?.user?.role}`} Account information
          </button>

          <h2>pickups</h2>
          <table>
            <caption>Today`&apos;`s List</caption>
            <thead>
              <tr>
                <th>order number</th>
                <th>customer name</th>
                <th>customer address</th>
                <th>pickup time</th>
                <th>utlitiy</th>
              </tr>
            </thead>
            <tbody>
              {pickups?.map((order) => {
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      {order?.customer?.firstName}
                      {order?.customer?.lastName}
                    </td>

                    <td>
                      <pre>
                        {order?.shipperAddress?.address}
                        {order?.shipperAddress?.address2}
                        {order?.shipperAddress?.address3}
                      </pre>
                    </td>
                    <td>
                      <DateTimeFormat
                        pickupDate={order?.pickupDate}
                        pickupTime={order?.pickupTime}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-blue"
                        onClick={() =>
                          router.push({
                            pathname: `/invoices/${order?.orderId}`,
                          })
                        }
                      >
                        pickup details
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}
    </>
  )
}

export default DriverHome

DriverHome.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
