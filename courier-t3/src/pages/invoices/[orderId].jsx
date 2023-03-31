import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
// import { useQuery } from 'react-query'
import { trpc } from '@/utils/trpc'
import { useRef } from 'react'
import { printJsx } from '@/components/printDocuments/Print'
import InvoiceReceipt from '@/components/printDocuments/InvoiceReceipt'
import DateTimeFormat from '@/components/DateTimeFormat'

import ReactToPrint from 'react-to-print'

const InvoicePage = () => {
  const router = useRouter()
  const { orderId } = router.query

  const invoiceReceiptRef = useRef()
  // note: finds invoice in local database
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

  // {/* checkout session has payment intent, find charge with payment intent after order is completed, add stripeReceiptUrl to local order */}

  const { data: stripeReceipt } = trpc.useQuery(
    [
      'stripe.getReceiptUrl',
      { stripePaymentIntent: order?.stripePaymentIntent },
    ],
    {
      enabled: order?.stripePaymentIntent !== null,
    }
  )

  if (getOrderDetailsStatus === 'error') return <div>error</div>

  if (getOrderDetailsStatus === 'loading') return <div>loading</div>

  return (
    <>
      {getOrderDetailsStatus === 'success' && (
        <section className="invoice-details-container">
          <h1>Invoice #{order?.id}</h1>
          {/* <button
            className="btn btn-blue"
            onClick={() => {
              syncCheckout.mutate({
                status: order?.status?.message,
                stripeCheckoutId: order?.stripeCheckoutId,
              })
            }}
          >
            get/sync with stripe checkout
          </button> */}
          {order?.paymentStatus === 'PENDING PAYMENT' &&
            order?.stripeCheckoutId && (
              <button
                className="btn btn-blue"
                onClick={() => {
                  router.push(order?.stripeCheckoutUrl)
                }}
              >
                finish stripe checkout:
              </button>
            )}

          {!!stripeReceipt && (
            <button
              className="btn btn-blue"
              onClick={() => {
                // console.log(stripeReceipt)
                // router.push(stripeReceipt)
                window.open(stripeReceipt)
              }}
            >
              View Stripe Reciept
            </button>
          )}

          {/* // TODO button to show option to change pickuptime if route not set */}
          {/* <button></button>

          <label className="block font-bold" htmlFor="meeting-time">
            Choose a time for your appointment:
          </label>

          <input
            type="datetime-local"
            id="meeting-time"
            name="meeting-time"
            value={order?.pickupDatetime}
            // min="2018-06-07T00:00"
            // max="2018-06-14T00:00"
          /> */}

          {/* <iframe id="stripeReceipt" src="google.com"></iframe> */}

          {!!order?.stripeCheckoutId && (
            <div>Stripe CheckoutId: {order?.stripeCheckoutId}</div>
          )}
          {!!order?.stripePaymentIntent && (
            <div>Stripe PaymentIntentId: {order?.stripePaymentIntent}</div>
          )}

          <pre>
            {'\n'}time ordered: {`${order?.timePlaced}`}
            {'\n'}
            <b>status: {order?.status?.message}</b>
            {'\n'}
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
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-blue">Print this out!</button>
            )}
            content={() => invoiceReceiptRef.current}
          />

          <pre
            ref={invoiceReceiptRef}
            className="border-1 block border-solid border-black"
          >
            OrderID: {order?.id}
            {/* <DateTimeFormat pickupDatetime={order?.pickupDatetime} /> */}
            <div className="w-max border border-black">
              <p className="font-bold underline">pickup time</p>
              <div>
                <DateTimeFormat pickupDatetime={order?.pickupDatetime} />
              </div>
            </div>
            {'\n'}Sender:{order?.customer?.firstName}{' '}
            {order?.customer?.lastName}
            {'\n'} Country: {order?.shipperAddress?.country}
            {'\n'} Address: {order?.shipperAddress?.address}
            {'\n'} Address2: {order?.shipperAddress?.address2 || 'N/A'}
            {'\n'} Address3: {order?.shipperAddress?.address3 || ' N/A'}
            {'\n'} City: {order?.shipperAddress?.city}
            {'\n'} PostalCode: {order?.shipperAddress?.postalCode}
            {'\n'} Cellphone: {order?.shipperAddress?.cellphone || 'N/A'}
            {'\n'} Telephone: {order?.shipperAddress?.telephone || 'N/A'}
            {'\n'}Reciever: {order?.recieverAddress?.firstName}
            {'\n'} Country: {order?.recieverAddress?.country}
            {'\n'} Address: {order?.recieverAddress?.address}
            {'\n'} Address2: {order?.recieverAddress?.address2 || 'N/A'}
            {'\n'} Address3: {order?.recieverAddress?.address3 || ' N/A'}
            {'\n'} City: {order?.recieverAddress?.city}
            {'\n'} PostalCode: {order?.recieverAddress?.postalCode}
            {'\n'} Cellphone: {order?.recieverAddress?.cellphone || 'N/A'}
            {'\n'} Telephone: {order?.recieverAddress?.telephone || 'N/A'}
            {'\n'}
            {'\n'}
            {/* route: {order.routeId} {'\n'} */}
            {JSON.stringify(order?.items, null, ' ')}
          </pre>
          {/* <code>STRIPE CHECKOUT:{JSON.stringify(order?.stripeCheckout)}</code> */}

          {/* <InvoiceReceipt order={order} /> */}
          {/* package reciepts printing */}

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
                <td>total: ${(order?.totalCost / 100).toLocaleString('en')}</td>
                {/* TODO: calculate total amount due for all items in the order */}
                {/* <td>{order.totalPrice}</td> */}
              </tr>
            </tbody>
          </table>

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
