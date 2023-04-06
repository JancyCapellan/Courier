import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
// import { useQuery } from 'react-query'
import { trpc } from '@/utils/trpc'
import DateTimeFormat from '@/components/DateTimeFormat'
import dayjs from 'dayjs'

const DriverPickupListPage = () => {
  const router = useRouter()
  // const { staff } = router.query
  // console.log('staff page router: ', router)
  const [driverId, setdriverId] = useState('')

  const [selectDate, setselectDate] = useState(dayjs().format('YYYY-MM-DD'))

  // * avoid router not being hydratged during a rerender or during page refersh
  useEffect(() => {
    if (!router.isReady) return

    setdriverId(router.query.driverId)
  }, [router.isReady, router.query.driverId])

  const { data: pickupList, status: getStaffStatus } = trpc.useQuery(
    [
      'staff.getDriverOrdersAsAdmin',
      { driverId: driverId, pickupDate: selectDate },
    ],
    {
      enabled: driverId !== '' && selectDate !== null,
      onSuccess: (data) => {
        // console.log({ data })
      },
      onError: (error) => {
        console.log('error fetching product types', error)
      },
    }
  )

  // let currentDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
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
      {getStaffStatus === 'success' && (
        <section className="driverAccountPage">
          <h1>
            {`${pickupList.staffInfo?.role}`}: {pickupList.staffInfo?.firstName}{' '}
            {pickupList.staffInfo?.lastName}
          </h1>
          <button
            onClick={() =>
              router.push({
                pathname: `/customers/${pickupList.staffInfo?.id}`,
              })
            }
          >
            Edit {`${pickupList.staffInfo?.role}`} Account information
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
              {pickupList?.orders.map((order) => {
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

export default DriverPickupListPage

DriverPickupListPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
