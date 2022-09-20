// import { useAuth } from '../contexts/authContext'
// import { useSession } from '../customHooks/useSession'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc'

import ModalContainer from '@/components/HOC/ModalContainer'
// import { backendClient } from '@/components/axiosClient.mjs'
import FormikControl from '@/components/Formik/FormikControl'
import UserAddressesTable from '@/components/Customers/[userId]/UserAddressesTable'
import AddCustomerAddressForm from '@/components/Customers/AddCustomerAddressForm'
// import { useGlobalStore } from '@/components/globalStore'
import InfoEditor from '@/components/pages/account/InfoEditor'

const UserAddresses = ({ currentUser }) => {
  // const [editAddress, setEditAddress] = useState({})
  const [showModal, setShowModal] = useState(false)
  // const [showAddressModal, setShowAddressModal] = useState(false)
  // const [showEditModal, setOpenEditModal] = useState(false)

  return (
    <>
      <section>
        <h2>
          Addresses for {`${currentUser.firstName}`} {`${currentUser.lastName}`}
        </h2>
        <button onClick={() => setShowModal(true)}>Add Address</button>
        <UserAddressesTable userId={currentUser.id} />
      </section>

      <AddCustomerAddressForm
        customerId={currentUser.id}
        show={showModal}
        handleClose={() => {
          setShowModal(false)
        }}
      />
    </>
  )
}

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
                            pathname: `/Invoices/${order.id}`,
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
    <section className='flex flex-col items-center h-full'>
      <h1 className='mb-4 mt-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl'>
        Account Information
      </h1>

      {/* create  tab menu  */}
      <nav className='flex flex-row gap-4'>
        <button className='btn btn-blue' onClick={() => setCurrentPage(1)}>
          Account Information
        </button>
        <button className='btn btn-blue' onClick={() => setCurrentPage(2)}>
          Addresses
        </button>
        <button className='btn btn-blue' onClick={() => setCurrentPage(3)}>
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
