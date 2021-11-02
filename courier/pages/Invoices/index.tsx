import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { GetServerSideProps, NextPage } from 'next'
import axios from 'axios'
import { useRouter } from 'next/router'

interface OrderData {
  id: number
  recieverFirstName: string
  recieverLastName: string
  totalPrice: number
  totalItems: number
  status: string
  location: string
  timePlaced: string
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const result = await axios.get(`http://localhost:3000/order/allOrders`)
    console.log('response', result.data)
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
  if (!props.listOfInvoices) {
    return <h1>error page 404</h1>
  }

  const router = useRouter()

  function openInvoice(id: number) {
    router.push({
      pathname: `/Invoices/${id}`,
      query: { orderId: id },
    })
  }

  const orderHistory = props.listOfInvoices
  console.log('list', orderHistory)
  return (
    <Sidebar>
      <h1>Current ORDERS</h1>
      <table>
        <caption>User Order History</caption>
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Datetime placed</th>
            <th>Sending to:</th>
            <th>total cost</th>
            <th>total items</th>
            <th>status</th>
            <th>location</th>
          </tr>
        </thead>
        <tbody>
          {orderHistory.map((order: OrderData) => {
            return (
              <tr key={order.id} onClick={() => openInvoice(order.id)}>
                <td>{order.id}</td>
                <td>{order.timePlaced}</td>
                <td>
                  {order.recieverFirstName} {order.recieverLastName}
                </td>
                <td>{order.totalPrice}</td>
                <td>{order.totalItems}</td>
                <td>{order.status} </td>
                <td>{order.location}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Sidebar>
  )
}

export default Invoices
