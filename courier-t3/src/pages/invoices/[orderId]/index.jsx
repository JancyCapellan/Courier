import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
// import { useQuery } from 'react-query'
import { trpc } from '@/utils/trpc'
import { useRef, useState } from 'react'
import { printJsx } from '@/components/printDocuments/Print'
import InvoiceReceipt from '@/components/printDocuments/InvoiceReceipt'
import DateTimeFormat from '@/components/DateTimeFormat'
import dayjs from 'dayjs'
import ReactToPrint from 'react-to-print'
import { QRCodeSVG } from 'qrcode.react'
import ModalContainer from '@/components/HOC/ModalContainer'

const InvoicePage = () => {
  const router = useRouter()
  const { orderId } = router.query

  const [showEditPickupDatetime, setshowEditPickupDatetime] = useState(false)

  let currentDate = dayjs().add(1, 'day').format('YYYY-MM-DD')

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
        <section className="flex flex-col">
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
            <div className="w-max border border-black">
              <p className="font-bold underline">pickup time</p>
              <button
                className="btn btn-blue"
                onClick={() => setshowEditPickupDatetime(true)}
              >
                edit pickup Datetime
              </button>
              <ModalContainer
                show={showEditPickupDatetime}
                handleClose={() => setshowEditPickupDatetime(false)}
              >
                <>
                  <div className="flex w-max flex-col">
                    <small>Pickups Monday to Saturday</small>
                    <input
                      type="date"
                      min={currentDate}
                      onChange={(e) => {
                        // console.log(e.target.value)
                        // let time = e
                        let date = e.target.value
                        date = dayjs(date).toISOString()
                        console.log(date)
                        setpickupDate(date)
                        // let time = e.target.value + ':00.000Z'
                        // setPotentialPickupDateTime(time)
                      }}
                      required
                    />

                    {/* // ? might need a change for cross complatibility, this is based on a time input with a 24 hour format */}
                    <div className="flex flex-row">
                      <input
                        type="time"
                        // min="09:00"
                        // max="17:30"
                        // step="00:10"
                        onChange={(e) => {
                          // console.log(e.target.value)
                          // let time = e
                          let time = e.target.value

                          const splitTime = time.split(':')

                          console.log({ splitTime })
                          let currentTimeHour = Number(splitTime[0])

                          let formattedTime = ''
                          // midnihgt 00, 01, .. , 12

                          if (currentTimeHour === 0) {
                            formattedTime = `12:${splitTime[1]} AM`
                            console.log({ formattedTime })
                            setpickupTime(formattedTime)
                            return
                          }

                          if (currentTimeHour === 12) {
                            formattedTime = `12:${splitTime[1]} PM`
                            console.log({ formattedTime })
                            setpickupTime(formattedTime)
                            return
                          }

                          if (currentTimeHour > 12 && currentTimeHour < 24) {
                            const twelveHourFormat = currentTimeHour - 12
                            formattedTime = `${twelveHourFormat}:${splitTime[1]} PM`
                            console.log({ formattedTime })

                            setpickupTime(formattedTime)
                            return
                          } else {
                            time = time + ' AM'
                          }

                          // time = dayjs(time).format('h:mm a')

                          console.log(time)
                          setpickupTime(time)
                          // let time = e.target.value + ':00.000Z'
                          // setPotentialPickupDateTime(time)
                        }}
                      />
                      <small>pickup hours are 9am to 5:30pm</small>
                    </div>
                  </div>
                </>
              </ModalContainer>
              <div>
                <DateTimeFormat
                  pickupDate={order?.pickupDate}
                  pickupTime={order?.pickupTime}
                />
              </div>
            </div>
          </pre>

          <button
            className="btn w-max bg-black text-white"
            onClick={() => {
              router.push(`/invoices/${order?.id}/edit`)
            }}
          >
            edit invoice
          </button>
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-blue w-max">
                Print Invoice Receipt
              </button>
            )}
            content={() => invoiceReceiptRef.current}
            bodyClass="InvoiceReceipt"
            pageStyle=""
          />
          <div className="">
            <div
              id="InvoiceReceipt"
              ref={invoiceReceiptRef}
              className="max-w-full border-2 border-solid border-black text-sm"
            >
              <div className="flex flex-row justify-between">
                <pre>
                  718-860-4300 {'\n'}
                  Luciano Shipping NYC {'\n'}
                  3440 Bailey Avenue {'\n'}
                  Bronx, NY, 10463{'\n'}
                  718-860-4300
                </pre>
                <pre>
                  809-581-7194 {'\n'}
                  Luciano Shipping DR {'\n'}
                  Autopista Juan Pablo Duarte {'\n'}
                  KM 1/1/2, Santiago {'\n'}
                  809-581-7194
                </pre>
              </div>
              <h2 className="text-center text-lg font-bold underline">
                OrderID: {order?.id}
              </h2>
              <p>
                Pickup Date: {dayjs(order?.pickupDatetime).format('MM/DD/YYYY')}
              </p>
              {/* <DateTimeFormat pickupDatetime={order?.pickupDatetime} /> */}
              <div className="flex flex-row justify-between">
                <pre>
                  {'\n'}Pickup/Shipper: {'\n'} {order?.customer?.firstName}{' '}
                  {order?.customer?.lastName}
                  {'\n'} Country: {order?.shipperAddress?.country}
                  {'\n'} Address: {'\n'}
                  {order?.shipperAddress?.address}
                  {'\n'} Address2: {order?.shipperAddress?.address2 || 'N/A'}
                  {'\n'} Address3: {order?.shipperAddress?.address3 || ' N/A'}
                  {'\n'} City: {order?.shipperAddress?.city}
                  {'\n'} PostalCode: {order?.shipperAddress?.postalCode}
                  {'\n'} Cellphone: {order?.shipperAddress?.cellphone || 'N/A'}
                  {'\n'} Telephone: {order?.shipperAddress?.telephone || 'N/A'}
                  {'\n'}
                </pre>
                <pre>
                  {'\n'}Delivery/Reciever: {'\n'}{' '}
                  {order?.recieverAddress?.firstName}{' '}
                  {order?.recieverAddress?.lastName}
                  {'\n'} Country: {order?.recieverAddress?.country}
                  {'\n'} Address: {'\n'}
                  {order?.recieverAddress?.address}
                  {'\n'} Address2: {order?.recieverAddress?.address2 || 'N/A'}
                  {'\n'} Address3: {order?.recieverAddress?.address3 || ' N/A'}
                  {'\n'} City: {order?.recieverAddress?.city}
                  {'\n'} PostalCode: {order?.recieverAddress?.postalCode}
                  {'\n'} Cellphone: {order?.recieverAddress?.cellphone || 'N/A'}
                  {'\n'} Telephone: {order?.recieverAddress?.telephone || 'N/A'}
                  {'\n'}
                  {'\n'}
                </pre>
              </div>

              <div className="flex flex-row justify-between">
                <table className="w-max">
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
                          <td>
                            {' '}
                            ${(item.product.price * item.quantity) / 100}
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        total: ${(order?.totalCost / 100).toLocaleString('en')}
                      </td>
                      {/* TODO: calculate total amount due for all items in the order */}
                      {/* <td>{order.totalPrice}</td> */}
                    </tr>
                  </tbody>
                </table>
                <QRCodeSVG
                  value={`OrderID:${order?.id}\nSender:${
                    order?.customer?.firstName
                  } ${order?.customer?.lastName}\n  Country: ${
                    order?.shipperAddress?.country
                  }\n  Address: ${
                    order?.shipperAddress?.address
                  }\n  Address2: ${
                    order?.shipperAddress?.address2 || 'N/A'
                  }\n  Address3: ${
                    order?.shipperAddress?.address3 || ' N/A'
                  }\n  City: ${order?.shipperAddress?.city}\n  PostalCode: ${
                    order?.shipperAddress?.postalCode
                  }\n  Cellphone: ${
                    order?.shipperAddress?.cellphone || 'N/A'
                  }\n  Telephone: ${
                    order?.shipperAddress?.telephone || 'N/A'
                  }\nReciever: ${
                    order?.recieverAddress?.firstName
                  }\n  Country: ${
                    order?.recieverAddress?.country
                  }\n  Address: ${
                    order?.recieverAddress?.address
                  }\n  Address2: ${
                    order?.recieverAddress?.address2 || 'N/A'
                  }\n  Address3: ${
                    order?.recieverAddress?.address3 || ' N/A'
                  }\n  City: ${order?.recieverAddress?.city}\n  PostalCode: ${
                    order?.recieverAddress?.postalCode
                  }\n  Cellphone: ${
                    order?.recieverAddress?.cellphone || 'N/A'
                  }\n  Telephone: ${
                    order?.recieverAddress?.telephone || 'N/A'
                  }`}
                  includeMargin={true}
                  level={'H'}
                  size={350}
                />
              </div>
            </div>
          </div>
          {/* <code>STRIPE CHECKOUT:{JSON.stringify(order?.stripeCheckout)}</code> */}

          {/* //Todo print labels for each item after order is confirmed*/}
          {/* package reciepts printing */}
        </section>
      )}
    </>
  )
}

export default InvoicePage

InvoicePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
