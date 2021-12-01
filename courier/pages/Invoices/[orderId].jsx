import Sidebar from '../../components/Sidebar'
import axios from 'axios'

export const getServerSideProps = async ({ params, res }) => {
  // const router = useRouter()
  const { orderId } = params
  try {
    const result = await axios.get(`http://localhost:3000/order/${orderId}`)
    console.log('response', result.data)
    return {
      props: {
        order: result.data,
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

const InvoicePage = ({ order }) => {
  // const initialValues = {2222222
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
  console.log(order)
  return (
    <Sidebar>
      <section>
        <h1>Invoice #{order.id}</h1>
        <pre>
          Customer: {order.user.firstName} {order.user.middleName} {order.user.lastName}
          {'\n'}
          {'\t'}
          Address: {order.addresses[0].address}
          {'\n'}
          shipping to: {order.recieverFirstName} {''} {order.recieverLastName} {'\n'}
          {'\t'}
          Address: {order.addresses[1].address}
          {'\n'}
          total price: {order.totalPrice}
          {'\n'}
          total items: {order.totalItems}
          {'\n'}
          status: {order.status}
          {'\n'}
          location: {order.location}
          {'\n'}
          time ordered: {`${order.timePlaced}`} {'\n'}
          {order.routeId} {'\n'}
          {order.pickupdriver ? (
            <b>
              pickup Driver: {order.pickupdriver.firstName} {order.pickupdriver.lastName}
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
    </Sidebar>
  )
}

export default InvoicePage
