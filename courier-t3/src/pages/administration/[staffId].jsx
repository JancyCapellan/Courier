import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
// import { useQuery } from 'react-query'
import { trpc } from '@/utils/trpc'

const DriverAccountPage = () => {
  const router = useRouter()
  // const { staff } = router.query
  // console.log('staff page router: ', router)
  const [staffId, setStaffId] = useState('')

  // * avoid router not being hydratged during a rerender or during page refersh
  useEffect(() => {
    if (!router.isReady) return

    setStaffId(router.query.staffId)
  }, [router.isReady, router.query.staffId])

  const { data: staff, status: getStaffStatus } = trpc.useQuery(
    ['staff.getUniqueStaff', { staffId: staffId }],
    {
      enabled: staffId !== '',
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
        <section className='driverAccountPage'>
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

export default DriverAccountPage

DriverAccountPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
