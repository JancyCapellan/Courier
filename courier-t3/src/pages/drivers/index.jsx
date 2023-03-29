import Layout from '@/components/Layout'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import React from 'react'
import StaffTable from '@/components/pages/administration/StaffTable'
// driver logs into app, gets a list of orders for the day
// DRIVER OPENS ORDER TO CONFIRM WITH CUSTOMER, CUSTOMER NEEDS TO ADD/REMOVE ITEMS, CONFIRM ORDER, PRINT INVOVICE RECEIPT WITH OVERALL DETAILS THEN PRINT A TAG FOR EACH PACKAGGE WITH INVOICE ID/ PAKCKAGE NUMBER / CONTENT

const DriverHome = () => {
  const { data: session, status: sessionStatus } = useSession()
  // const pickupList = trpc.useQuery(
  //   ['invoice.getAllDriverOrders', { driverId: session?.user?.id }],
  //   {
  //     enabled: sessionStatus === 'authenticated',
  //   }
  // )

  const { data: staff, status: getStaffStatus } = trpc.useQuery(
    ['staff.getUniqueStaff', { staffId: session?.user?.id }],
    {
      enabled: sessionStatus === 'authenticated',
      onSuccess: (data) => {
        console.log('account page:', data)
      },
      onError: (error) => {
        console.log('error fetching product types', error)
      },
    }
  )

  console.log('staff', staff)

  return (
    <>
      {getStaffStatus === 'success' && (
        <section className="driverAccountPage">
          <h1>
            {`${staff?.role}`}: {staff?.firstName} {staff?.lastName}
          </h1>
          <button
            onClick={() =>
              router.push({
                pathname: `/customers/${staff?.id}`,
              })
            }
          >
            Edit {`${staff?.role}`} Account information
          </button>

          <h2>pickups</h2>
          <table>
            <caption>Today`&apos;`s List</caption>
            <thead>
              <tr>
                <th>order number</th>
                <th> customer name</th>
                <th>customer address</th>
                {/* <th>pickup time</th> */}
              </tr>
            </thead>
            <tbody>
              {staff?.pickups.map((order) => {
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      {order?.customer?.firstName}
                      {order?.customer?.lastName}
                    </td>

                    <td>
                      <pre>
                        {JSON.stringify(order.addresses[0], undefined, 2)}
                      </pre>
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
