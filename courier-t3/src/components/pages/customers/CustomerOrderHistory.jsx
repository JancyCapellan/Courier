import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

export const CustomerOrderHistory = ({ currentUser }) => {
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
        <table>
          <caption>User Order History</caption>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>time placed</th>
              <th>Sending to:</th>
              <th>status</th>
              {/* <th>location</th> */}
              <th>utilities</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory?.map((order) => {
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order?.timePlaced}</td>
                  <td>
                    {order?.addresses[1]?.firstName}{' '}
                    {order?.addresses[1]?.lastName}
                  </td>
                  {/* <td>{order.totalPrice}</td>
                  <td>{order.totalItems}</td> */}
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
      ) : (
        <>
          <p>order history is loading</p>
        </>
      )}
    </>
  )
}
