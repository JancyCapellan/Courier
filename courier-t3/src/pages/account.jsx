import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc'
import InfoEditor from '@/components/pages/account/InfoEditor'
import { CustomerAddresses as UserAddresses } from '@/components/pages/customers/CustomerAddresses'

const UserOrderHistory = ({ currentUser }) => {
  const router = useRouter()

  const { data: orderHistory, status: userOrderStatus } = trpc.useQuery([
    'user.getUserOrders',
    { userId: currentUser.id },
  ])

  console.log('user order History', orderHistory)
  return (
    <>
      <h1>ORDERS</h1>
      {userOrderStatus === 'success' ? (
        !orderHistory?.length ? (
          <p>NO ORDERS FOR USER FOUND</p>
        ) : (
          <table>
            <caption>User Order History</caption>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>time placed</th>
                <th>Sending to:</th>
                <th>total cost</th>
                <th>total items</th>
                <th>status</th>
                {/* <th>location</th> */}
                <th>utilities</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order) => {
                return (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.timePlaced}</td>
                    <td>
                      {order.recieverFirstName} {order.recieverLastName}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>{order.totalItems}</td>
                    <td>{order.status.message} </td>
                    {/* <td>{order.location}</td> */}
                    <td>
                      <button
                        onClick={() =>
                          router.push({
                            pathname: `/invoices/${order.id}`,
                            // query: { orderId: id },
                          })
                        }
                      >
                        invoice page
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      ) : (
        <>
          <p>order history is loading</p>
        </>
      )}
    </>
  )
}

const AccountInfo = () => {
  // const [session, loading] = useSession()
  const { data: session, status: sessionStatus } = useSession()
  const [currentPage, setCurrentPage] = useState(1)

  const userInfo = trpc.useQuery(
    ['user.getUserAccountInfo', { userId: session?.user?.id }],
    {
      enabled: sessionStatus === 'authenticated',
    }
  )
  // console.log({ userInfo })

  function ComponentSwitcher({ user }) {
    switch (currentPage) {
      case 1:
        return <InfoEditor currentUser={user} />
      case 2:
        return <UserAddresses currentUser={user} />
      case 3:
        return <UserOrderHistory currentUser={user} />
      default:
        return <h1>DEFAULT</h1>
    }
  }

  return (
    <section className="flex h-full flex-col items-center">
      <h1>Account Information</h1>

      {/* create  tab menu  */}
      <nav className="flex flex-row gap-4">
        <button className="btn btn-blue" onClick={() => setCurrentPage(1)}>
          Account Information
        </button>
        <button className="btn btn-blue" onClick={() => setCurrentPage(2)}>
          Addresses
        </button>
        <button className="btn btn-blue" onClick={() => setCurrentPage(3)}>
          Order History
        </button>
      </nav>
      {/* <br /> */}
      {userInfo.status === 'success' ? (
        <ComponentSwitcher user={userInfo.data} />
      ) : (
        <></>
      )}
      {/* <br /> */}
    </section>
  )
}

export default AccountInfo

AccountInfo.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

// AccountInfo.auth = () => {
//   return 'private'
// }
