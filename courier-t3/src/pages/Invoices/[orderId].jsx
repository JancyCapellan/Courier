import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
// import { useQuery } from 'react-query'
import { trpc } from '@/utils/trpc'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

const InvoicePage = () => {
  const [totalOrderPriceSum, setTotalOrderPriceSum] = useState(0)
  const router = useRouter()
  const { orderId } = router.query
  const {
    data: order,
    status: getOrderDetailsStatus,
    refetch: refetchOrder,
  } = trpc.useQuery(['invoice.getOrderById', { orderId: parseInt(orderId) }], {
    refetchOnMount: 'always',
    enabled: orderId !== null,
  })

  // note: checks stripe database for order, sync the order to app database, then retefches the order. mostly a for development
  const syncCheckout = trpc.useMutation(
    ['stripe.getStripeCheckoutDetailsFromStripe'],
    {
      onSuccess: () => refetchOrder(),
    }
  )

  if (getOrderDetailsStatus === 'error') return <div>error</div>

  if (getOrderDetailsStatus === 'loading') return <div>loading</div>

  // button that checks stripeCheckout by id to sync checkout if needed

  return (
    <>
      {getOrderDetailsStatus === 'success' && (
        <section className="invoice-details-container">
          <h1>Invoice #{order?.id}</h1>
          <button
            className="btn btn-blue"
            onClick={() => {
              syncCheckout.mutate({
                status: order?.status?.message,
                stripeCheckoutId: order?.stripeCheckoutId,
              })
            }}
          >
            get/sync with stripe checkout
          </button>
          <pre>
            OrderID: {order?.id}
            {'\n'}Sender:{order?.customer.firstName} {order?.customer.lastName}
            {'\n'} Country: {order?.addresses[0]?.country}
            {'\n'} Address: {order?.addresses[0]?.address}
            {'\n'} Address2: {order?.addresses[0]?.address2 || 'N/A'}
            {'\n'} Address3: {order?.addresses[0]?.address3 || ' N/A'}
            {'\n'} City: {order?.addresses[0]?.city}
            {'\n'} PostalCode: {order?.addresses[0]?.postalCode}
            {'\n'} Cellphone: {order?.addresses[0]?.cellphone || 'N/A'}
            {'\n'} Telephone: {order?.addresses[0]?.telephone || 'N/A'}
            {'\n'}Reciever: {order?.addresses[1]?.firstName}
            {'\n'} Country: {order?.addresses[1]?.country}
            {'\n'} Address: {order?.addresses[1]?.address}
            {'\n'} Address2: {order?.addresses[1]?.address2 || 'N/A'}
            {'\n'} Address3: {order?.addresses[1]?.address3 || ' N/A'}
            {'\n'} City: {order?.addresses[1]?.city}
            {'\n'} PostalCode: {order?.addresses[1]?.postalCode}
            {'\n'} Cellphone: {order?.addresses[1]?.cellphone || 'N/A'}
            {'\n'} Telephone: {order?.addresses[1]?.telephone || 'N/A'}
            {'\n'}
            {'\n'}
            {'\n'}time ordered: {`${order?.timePlaced}`}
            {'\n'}
            <b>status: {order?.status?.message}</b>
            {'\n'}
            {/* route: {order.routeId} {'\n'} */}
            {order?.pickupDriver ? (
              <b>
                pickup Driver: {order?.pickupDriver.firstName}{' '}
                {order?.pickupDriver.lastName}
              </b>
            ) : (
              <p>
                <b>pickup Driver: none</b>
              </p>
            )}
          </pre>
          {/* <code>STRIPE CHECKOUT:{JSON.stringify(order?.stripeCheckout)}</code> */}

          <table>
            <caption>
              <b>Items For Invoice#{order?.id}</b>
            </caption>
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
                <th>Per Item Price</th>
                <th>grouped price</th>
              </tr>
            </thead>
            <tbody>
              {order?.items.map((item) => {
                return (
                  <tr key={item.product.name}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.product.price / 100}</td>
                    <td> ${(item.product.price * item.quantity) / 100}</td>
                  </tr>
                )
              })}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>total: ${totalOrderPriceSum}</td>
                {/* TODO: calculate total amount due for all items in the order */}
                {/* <td>{order.totalPrice}</td> */}
              </tr>
            </tbody>
          </table>

          <QRCodeSVG
            value={`OrderID:${order?.id}\nSender:${order?.customer.firstName} ${
              order?.customer.lastName
            }\n  Country: ${order?.addresses[0]?.country}\n  Address: ${
              order?.addresses[0]?.address
            }\n  Address2: ${
              order?.addresses[0]?.address2 || 'N/A'
            }\n  Address3: ${
              order?.addresses[0]?.address3 || ' N/A'
            }\n  City: ${order?.addresses[0]?.city}\n  PostalCode: ${
              order?.addresses[0]?.postalCode
            }\n  Cellphone: ${
              order?.addresses[0]?.cellphone || 'N/A'
            }\n  Telephone: ${
              order?.addresses[0]?.telephone || 'N/A'
            }\nReciever: ${order?.addresses[1]?.firstName}\n  Country: ${
              order?.addresses[1]?.country
            }\n  Address: ${order?.addresses[1]?.address}\n  Address2: ${
              order?.addresses[1]?.address2 || 'N/A'
            }\n  Address3: ${
              order?.addresses[1]?.address3 || ' N/A'
            }\n  City: ${order?.addresses[1]?.city}\n  PostalCode: ${
              order?.addresses[1]?.postalCode
            }\n  Cellphone: ${
              order?.addresses[1]?.cellphone || 'N/A'
            }\n  Telephone: ${order?.addresses[1]?.telephone || 'N/A'}`}
            includeMargin={false}
            level={'Q'}
            size={220}
          />

          {/* <QRCodeSVG value={'google.com'} /> */}
        </section>
      )}
    </>
  )
}

export default InvoicePage

InvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
