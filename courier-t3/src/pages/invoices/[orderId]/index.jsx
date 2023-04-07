import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
// import { useQuery } from 'react-query'
import { trpc } from '@/utils/trpc'
import { useRef, useState, useEffect } from 'react'
import { printJsx } from '@/components/printDocuments/Print'
import InvoiceReceipt from '@/components/printDocuments/InvoiceReceipt'
import DateTimeFormat from '@/components/DateTimeFormat'
import dayjs from 'dayjs'
import ReactToPrint from 'react-to-print'
import { QRCodeSVG } from 'qrcode.react'
import ModalContainer from '@/components/HOC/ModalContainer'
import InvoicePaymentForm from '@/components/pages/invoices/InvoicePaymentForm'
import { useSession } from 'next-auth/react'

const InvoiceOrderDetailsPage = () => {
  const router = useRouter()
  const { orderId } = router.query

  const [showEditPickupDatetime, setshowEditPickupDatetime] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentType, setPaymentType] = useState('')

  let currentDate = dayjs().add(1, 'day').format('YYYY-MM-DD')

  const { data: session, status: sessionStatus } = useSession()

  const invoiceReceiptRef = useRef()
  // note: finds invoice in local database
  const {
    data: order,
    status: getOrderDetailsStatus,
    refetch: refetchOrder,
  } = trpc.useQuery(['invoice.getOrderById', { orderId: orderId }], {
    refetchOnMount: 'always',
    enabled: !!router.query.orderId,
  })

  // note: checks stripe database for order, sync the order to app database, then retefches the order. mostly a for development
  const syncCheckout = trpc.useMutation(
    ['stripe.getStripeCheckoutDetailsFromStripe'],
    {
      onSuccess: () => refetchOrder(),
    }
  )

  const {
    data: invoicePayments,
    status: invoicePaymentStatus,
    refetch: refetchInvoicePayments,
  } = trpc.useQuery(['invoice.getInvoicePayments', { orderId: orderId }], {
    enabled: !!orderId,
  })

  //only when invoice payment is not confirmed
  const deleteInvoicePayment = trpc.useMutation(
    ['invoice.deleteInvoicePayment'],
    {
      onSuccess: () => {
        // refetchOrder()
        refetchInvoicePayments()
      },
    }
  )

  const confirmPayment = trpc.useMutation(['invoice.confirmInvoicePayment'], {
    onSuccess: () => {
      refetchOrder()
      refetchInvoicePayments()
    },
  })

  const unconfirmPayment = trpc.useMutation(
    ['invoice.unconfirmInvoicePayment'],
    {
      onSuccess: () => {
        refetchOrder()
        refetchInvoicePayments()
      },
    }
  )

  // {/* checkout session has payment intent, find charge with payment intent after order is completed, add stripeReceiptUrl to local order */}

  // const { data: stripeReceipt } = trpc.useQuery(
  //   [
  //     'stripe.getReceiptUrl',
  //     { stripePaymentIntent: order?.stripePaymentIntent },
  //   ],
  //   {
  //     enabled: order?.stripePaymentIntent !== null,
  //   }
  // )

  if (getOrderDetailsStatus === 'error') return <div>error</div>

  if (getOrderDetailsStatus === 'loading' || sessionStatus === 'loading')
    return <div>loading</div>

  let totalBalanceRemaining =
    order?.totalCost / 100 - order?.totalBalancePaid / 100
  return (
    <>
      {getOrderDetailsStatus === 'success' && (
        <section className="flex flex-col">
          <h1>Order #{order?.id}</h1>

          <button
            className="btn w-max bg-black text-white"
            onClick={() => {
              router.push(`/invoices/${order?.orderId}/edit`)
            }}
          >
            edit invoice
          </button>
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

          {/* {!!stripeReceipt && (
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
          )} */}

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

          {/* // ? TODO while paymentStatus is not complete/finish show payment options */}
          <div>
            <h3 className="font-bold underline">PAYMENTS</h3>
            <small>
              you can make multiple payments if needed, just choose the correct
              option
            </small>
            <div>
              <p className=" text-blue-400">
                total cost: ${(order?.totalCost / 100).toLocaleString('en')}
              </p>
              <p className="text-orange-500">
                total Paid: $
                {(order?.totalBalancePaid / 100).toLocaleString('en')}
              </p>
              <p className="text-red-600">
                remaining balance: ${totalBalanceRemaining.toLocaleString('en')}
              </p>
              <button
                className="btn bg-red-500"
                onClick={() => {
                  if (confirm('Confirm Invoice has been completed paid')) {
                  }
                }}
              >
                Confirm Invoice Paid
              </button>
              {/* { if (totalBalanceRemaining === 0) <button></button> } */}
            </div>

            <div className="flex flex-row">
              {/* customer can choose, but driver/staff must confirm, staff in office always confirm payments */}
              <button
                className="btn btn-blue"
                onClick={() => {
                  setPaymentType('cash')
                  setShowPaymentModal(true)
                }}
              >
                Cash
              </button>
              <button
                className="btn btn-blue"
                onClick={() => {
                  setPaymentType('check')
                  setShowPaymentModal(true)
                }}
              >
                check
              </button>
              <button className="btn btn-blue">Quickpay</button>
              {/* if customer doesnt want stripe and straight card they can choose card and call to pay */}
              <button className="btn btn-blue">Card</button>
              <button className="btn btn-blue">Stripe</button>
              <button className="btn btn-blue">Bank Transfer</button>
            </div>
          </div>
          <ModalContainer
            show={showPaymentModal}
            handleClose={() => setShowPaymentModal(false)}
          >
            <InvoicePaymentForm
              orderId={orderId}
              paymentType={paymentType}
              closeModal={() => setShowPaymentModal(false)}
              refetchPayments={refetchInvoicePayments}
            />
          </ModalContainer>

          {/* payments table, paymentid, type, amount paid */}
          <div>
            {invoicePaymentStatus === 'success' ? (
              <table className="w-max">
                <caption>Payments</caption>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>type</th>
                    <th>paid</th>
                    <th>confirm</th>
                    <th>utility</th>
                  </tr>
                </thead>
                <tbody>
                  {invoicePayments.map((payment) => {
                    return (
                      <tr key={payment?.id}>
                        <td>{payment?.id}</td>
                        <td>{payment?.paymentType}</td>
                        <td>
                          ${(payment?.amountPaid / 100).toLocaleString('en')}
                        </td>
                        <td>{!!!payment?.confirmed ? 'false' : 'true'}</td>
                        {/* payments can be delete if not confirmed and invoice is also not completed/ finalized */}
                        {order?.paymentStatus !== 'PAID' ? (
                          <td className="flex flex-row gap-1">
                            {!!!payment?.confirmed ? (
                              <>
                                {' '}
                                <button
                                  className="btn btn-blue"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        'Are you sure you want to delete payment?'
                                      )
                                    ) {
                                      deleteInvoicePayment.mutate({
                                        paymentId: payment?.id,
                                      })
                                    }
                                  }}
                                >
                                  delete payment
                                </button>
                              </>
                            ) : (
                              <></>
                            )}

                            {(session?.user?.role !== 'STAFF' ||
                              session?.user?.role !== 'ADMIN') &&
                            !!!payment?.confirmed ? (
                              <button
                                className="btn btn-blue"
                                onClick={() => {
                                  if (
                                    confirm(
                                      'Are you sure you want to confirm payment?'
                                    )
                                  )
                                    confirmPayment.mutate({
                                      paymentId: payment?.id,
                                    })
                                }}
                              >
                                confirm payment
                              </button>
                            ) : (
                              session?.user?.role === 'ADMIN' && (
                                <button
                                  className="btn btn-blue"
                                  onClick={() => {
                                    if (
                                      confirm(
                                        'Are you sure you want to unconfirm payment?'
                                      )
                                    )
                                      unconfirmPayment.mutate({
                                        paymentId: payment?.id,
                                      })
                                  }}
                                >
                                  unconfirm payment
                                </button>
                              )
                            )}
                          </td>
                        ) : (
                          <></>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <></>
            )}
          </div>

          {/* invoice details */}
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

          {/* at this point is when an invoice is created, the shipper has confirmed with the driver/staff that this is the order they want to send.  */}
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
                OrderID: {order?.orderId}
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
                  value={`OrderID:${order?.orderId}\nSender:${
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

export default InvoiceOrderDetailsPage

InvoiceOrderDetailsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
