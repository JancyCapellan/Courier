import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import { trpc } from '@/utils/trpc'
import InfoEditor from '@/components/pages/account/InfoEditor'
import { CustomerAddresses as UserAddresses } from '@/components/pages/customers/CustomerAddresses'
import SelectDeliveryAddress from '@/components/pages/order/CreateOrder/SelectDeliveryAddress'
import CustomerDeliveryAddresses from '@/components/pages/customers/[userId]/CustomerDeliveryAddresses'
import FancyTable from '@/components/Tables/FancyTable'

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
        return (
          <>
            <UserAddresses currentUser={user} />
            <CustomerDeliveryAddresses currentCustomerId={user?.id} />
          </>
        )
      case 3:
        return <UserOrderHistory currentUser={user} />
      default:
        return <h1>DEFAULT</h1>
    }
  }

  return (
    <div className="flex h-full flex-col items-center">
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
    </div>
  )
}

export default AccountInfo

AccountInfo.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

const UserOrderHistory = ({ currentUser }) => {
  const router = useRouter()

  const {
    data: orderHistory,
    status: userOrderStatus,
    isSuccess: orderHistoryIsSuccess,
    isError: orderHistoryIsError,
  } = trpc.useQuery(['user.getUserOrders', { userId: currentUser.id }])

  const data = useMemo(() => {
    if (!orderHistory) return []
    return orderHistory
  }, [orderHistory])

  // th>Order Id</th>
  //               <th>time placed</th>
  //               <th>Sending to:</th>
  //               <th>total cost</th>
  //               <th>total items</th>
  //               <th>status</th>
  //               {/* <th>location</th> */}
  //               <th>utilities</th>
  const columns = useMemo(
    () => [
      {
        Header: 'Order ID',
        accessor: 'id',
      },
      {
        Header: 'Delivery Address',
        accessor: 'recieverAddress.address',
      },
      {
        Header: 'Status',
        accessor: 'statusMessage',
      },
      {
        Header: 'totalCost',
        accessor: 'totalCost',
        Cell: ({ row }) => {
          return `$${Number(row.values.totalCost / 100).toLocaleString('en')} `
        },
      },
      {
        Header: 'Balance',
        accessor: 'currentBalance',
      },
      {
        Header: 'utility',
        Cell: ({ row: { original } }) => (
          <>
            <button
              onClick={() =>
                router.push({
                  pathname: `/invoices/${original.id}`,
                })
              }
            >
              Invoice page
            </button>
          </>
        ),
      },

      // {
      //   Header: '',
      //   accessor: '',
      // },
    ],
    []
  )
  return (
    <>
      <h1>ORDERS</h1>
      {userOrderStatus === 'success' ? (
        !orderHistory?.length ? (
          <p>NO ORDERS FOR USER FOUND</p>
        ) : (
          <div className="w-max">
            <FancyTable columns={columns} data={data} />
          </div>
        )
      ) : (
        <>
          <p>order history is loading</p>
        </>
      )}
    </>
  )
}
