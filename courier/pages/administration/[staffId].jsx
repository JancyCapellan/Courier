import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { backendClient } from '../../components/axiosClient.mjs'
import { useQuery } from 'react-query'

const DriverAccountPage = () => {
  const router = useRouter()
  // const { staff } = router.query
  // console.log('staff page router: ', router)
  const [staffId, setStaffId] = useState(false)

  // * avoid router not being hydratged during a rerender or during page refersh
  useEffect(() => {
    if (!router.isReady) return

    setStaffId(router.query.staffId)
  }, [router.isReady, router.query.staffId])

  const getUniqueStaff = async () => {
    const { data } = await backendClient.get(`user/users/getUniqueStaff/` + staffId)
    // console.log('DRIVERS DATA', data)
    return data
  }
  const { data: staff, status: getStaffStatus } = useQuery('getUniqueStaff', getUniqueStaff, {
    enabled: staffId !== false,
    onSuccess: (data) => {
      console.log('account page:', data)
    },
    onError: (error) => {
      console.log('error fetching product types', error)
    },
  })

  console.log('staff', staff)

  return (
    <>
      {getStaffStatus === 'success' && (
        <section className='driverAccountPage'>
          <h1>
            {`${staff.role}`}: {staff.firstName} {staff.lastName}
          </h1>
          <button
            onClick={() =>
              router.push({
                pathname: `/customers/${staff.id}`,
              })
            }
          >
            Edit {`${staff.role}`} Account information
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
              {staff.pickups.map((order) => {
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      {order.user.firstName}
                      {order.user.lastName}
                    </td>

                    <td>
                      <pre>{JSON.stringify(order.addresses[0], undefined, 2)}</pre>
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
