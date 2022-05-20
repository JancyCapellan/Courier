import React, { useState, useEffect, ReactElement, ReactNode } from 'react'
import Sidebar from '../../components/Sidebar'
import { GetServerSideProps, NextPage } from 'next'
import axios from 'axios'
import { useRouter } from 'next/router'
import DateTime from 'luxon'
import Layout from '../../components/Layout'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}
interface OrderData {
  id: number
  recieverFirstName: string
  recieverLastName: string
  totalPrice: number
  totalItems: number
  status: string
  location: string
  timePlaced: string
  pickupDriverId: number
  pickupdriver: user
  pickupDatetime: string
  user: user
}

interface user {
  firstName: string
  lastName: string
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const result = await axios.get(`http://localhost:3000/order/allOrders`)
    // console.log('response', result.data)
    return {
      props: {
        listOfInvoices: result.data,
      },
    }
  } catch (error) {
    res.statusCode = 500
    console.log('getcustomer', error)
    return {
      props: {},
    }
  }
}

export const Invoices: NextPage<{ listOfInvoices: OrderData[] }> = (props) => {
  const router = useRouter()
  const [currentBranch, setCurrentBranch] = useState<string>('NYC')

  if (!props.listOfInvoices) {
    return <h1>error page 404</h1>
  }

  function openInvoice(id: number) {
    router.push({
      pathname: `/Invoices/${id}`,
      // query: { orderId: id },
    })
  }

  async function updateOrderDriver(orderId: number, driverId: number) {
    console.log('updated order', orderId, driverId)

    const result = await axios.put(`http://localhost:3000/order/${orderId}/`, {
      pickupDriverId: driverId,
    })

    console.log('updateOrderDriver', result)
    // router.reload()
  }

  const orderHistory = props.listOfInvoices
  console.log('list', orderHistory)
  return (
    <Layout>
      <h1>Current ORDERS - {currentBranch}</h1>
      <label>
        Branch Name:
        <select name='branches' onChange={(e) => setCurrentBranch(e.currentTarget.value)}>
          <option key='default'>default branch</option>
          <option key='NYC'>NYC</option>
          <option key='DR'>DR</option>
          <option key='MIAMI'>MIAMI</option>
        </select>
      </label>

      {currentBranch ? (
        <table>
          <caption>User Order History</caption>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Sent by:</th>
              <th>Sending to:</th>
              <th>Datetime placed</th>
              <th>total cost</th>
              <th>total items</th>
              <th>status</th>
              <th>location</th>
              <th>Pickup Driver</th>
              <th>Pickup Time</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order: OrderData) => {
              return (
                <tr key={order.id}>
                  <td onClick={() => openInvoice(order.id)}>{order.id}</td>
                  <td>
                    {order.user.firstName} {order.user.lastName}
                  </td>
                  <td>
                    {order.recieverFirstName} {order.recieverLastName}
                  </td>
                  <td onClick={() => openInvoice(order.id)}>{order.timePlaced}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.totalItems}</td>
                  <td>{order.status} </td>
                  <td>{order.location}</td>
                  <td>
                    {order.pickupDriverId ? (
                      <div>
                        {order.pickupdriver.firstName} {order.pickupdriver.lastName}
                        <select
                          style={{ width: '1.5em' }}
                          onChange={(e) => updateOrderDriver(order.id, parseInt(e.target.value))}
                        >
                          <option value={'NULL'}>select driver</option>
                          <option value={'NULL'}>none</option>
                          <option value={3}>Driver Tester</option>
                        </select>
                      </div>
                    ) : (
                      <select
                        onChange={(e) => updateOrderDriver(order.id, parseInt(e.target.value))}
                      >
                        <option value={'null'}>none/select driver</option>
                        <option value={'cl0k3wqoe000608uy29tcc12z'}>Juan Driver</option>
                      </select>
                    )}
                  </td>
                  <td>{order.pickupDatetime}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <h3> CHOOSE BRANCH </h3>
      )}
    </Layout>
  )
}

export default Invoices

// Invoices.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>
// }
