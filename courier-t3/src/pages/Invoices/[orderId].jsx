import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
// import { useQuery } from 'react-query'
import { trpc } from '@/utils/trpc'

const getOrderDetails = async (orderId) => {
  try {
    const { data } = await backendClient.get(`order/${orderId}`)
    console.log('order:', data)
    return data
  } catch (error) {
    res.statusCode = 500
  }
}

const InvoicePage = () => {
  const router = useRouter()
  const { orderId } = router.query
  const { data: order, status: getOrderDetailsStatus } = useQuery(
    ['getOrderDetails', orderId],
    () => getOrderDetails(orderId)
  )
  // const initialValues = {
  // id: number
  // recieverFirstName: string
  // recieverLastName: string
  // totalPrice: number
  // totalItems: number
  // status: string
  // location: string
  // timePlaced: string
  // routeId: number
  // }
  return (
    <>
      {getOrderDetails === 'error' && <div>error</div>}
      {getOrderDetails === 'loading' && <div>loading</div>}
      {getOrderDetailsStatus === 'success' && (
        <section className="invoice-details-container">
          <h1>Invoice #{order.id}</h1>
          <pre>
            Customer: {order.user.firstName} {order.user.middleName}{' '}
            {order.user.lastName}
            {'\n'}
            {'\t'}
            Address: {order.addresses[0].address}
            {'\n'}
            shipping to: {order.recieverFirstName} {''} {order.recieverLastName}{' '}
            {'\n'}
            {'\t'}
            Address: {order.addresses[1].address}
            {'\n'}
            total price: {order.totalPrice}
            {'\n'}
            total items: {order.totalItems}
            {'\n'}
            status: {order.status.message}
            {'\n'}
            time ordered: {`${order.timePlaced}`} {'\n'}
            {order.routeId} {'\n'}
            {order.pickupdriver ? (
              <b>
                pickup Driver: {order.pickupdriver.firstName}{' '}
                {order.pickupdriver.lastName}
              </b>
            ) : (
              <p>
                <b>pickup Driver: none</b>
              </p>
            )}
          </pre>
          <table>
            <caption>
              <b>Items For Invoice#{order.id}</b>
            </caption>
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
                <th>type</th>
                <th>Per Item Price</th>
                <th>grouped price</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.product.name}</td>
                    <td>{item.amount}</td>
                    <td>{item.product.productType.type}</td>
                    <td>{item.product.price}</td>
                    <td> {item.product.price * item.amount}</td>
                  </tr>
                )
              })}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>total:</td>
                <td>{order.totalPrice}</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </>
  )
}

export default InvoicePage

InvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
