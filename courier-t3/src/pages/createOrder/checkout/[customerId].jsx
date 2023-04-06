//@ts-nocheck
import Layout from '@/components/Layout'
import Cart from '@/components/pages/order/CreateOrder/Cart'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CreateOrder from '..'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

// TODO min pickup date is currently the start of the current day of setting, can possibly make it to be the next day? exclude sundays?
function getCurrentDate() {
  let current = new Date().toISOString().split('T')
  let zTime = '00' + ':' + '00'
  let dateTime = current[0] + 'T' + zTime
  return dateTime
}

// review cart order, addresses, and items, and proceed to stripe checkout and creating an invoice for the order
const Checkout = () => {
  const router = useRouter()

  const { data: session, status: sessionStatus } = useSession()

  const [potentialPickupDateTime, setPotentialPickupDateTime] = useState(null)

  const [pickupDate, setpickupDate] = useState(null)
  const [pickupTime, setpickupTime] = useState(null)

  const { data: cart, status: cartStatus } = trpc.useQuery(
    [
      'cart.getCartSession',
      { userId: session?.user?.id, customerId: router.query.customerId },
    ],
    {
      onSuccess: (data) => {
        // console.log('TCL: [line 20][checkout.jsx] data: ', data)
        // console.log('🚀 ~ file: checkout.jsx ~ line 20 ~ Checkout ~ data', data)
      },
      enabled: sessionStatus === 'authenticated' && !!router.query.customerId,
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      staleTime: 0,
      cacheTime: 60 * 1000,
    }
  )
  const clearCartById = trpc.useMutation(['cart.clearCartById'])

  const updateBalance = trpc.useMutation([''])

  const createPendingOrder = trpc.useMutation(
    ['cart.createPendingOrderBeforeCheckoutCompletes'],
    {
      onSuccess: (data) => {
        // clearCartById.mutate({ cartId: cart?.cartId })

        router.push(`/invoices/${data?.orderId}`)
        // console.log('HERREEEE', data)
        // console.log(
        //   'pending order created, clearing cart',
        //   session?.user?.id,
        //   router.query.customerId
        // )
        // ? idk maybe return to place of review
        // clearCart.mutate({
        //   userId: session?.user?.id,
        //   customerId: router?.query?.customerId,
        // })
      },
      onError: (err) => {
        console.error(err)
      },
    }
  )

  function createPendingOrderWrapper(paymentType) {
    createPendingOrder.mutate({
      userId: session?.user?.id,
      customerId: router.query.customerId,
      paymentType: paymentType,
      pickupDateTime: potentialPickupDateTime,
    })

    //TODO: SEPERATE account components page by routes
    if (session.user.role === 'CUSTOMER') {
      router.push('/account')
    } else {
      router.push('/invoices')
    }
  }

  const createCheckoutSession = trpc.useMutation(
    ['stripe.createCheckoutSession'],
    {
      onSuccess: (stripeCheckoutSession) => {
        createPendingOrder.mutate({
          userId: session?.user?.id,
          customerId: router.query.customerId,
          stripeCheckoutId: stripeCheckoutSession.id,
          paymentType: 'STRIPE',
          stripeCheckoutUrl: stripeCheckoutSession.url,
          pickupDateTime: potentialPickupDateTime,
          // stripePaymentIntent: stripeCheckoutSession.payment_intent,
        })

        // console.log('PENDING Checkout Created')

        // clear cart, once a payment is chosen

        if (stripeCheckoutSession.url) router.push(stripeCheckoutSession.url)
      },
      onError: (err) => {
        console.error(err)
      },
    }
  )

  if (sessionStatus === 'loading' || cartStatus === 'loading')
    return <div>Loading...</div>

  const stripeReturnStatus = router.query?.stripe

  const backlink = `/createOrder?customerId=${router.query?.customerId}`

  let currentDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
  return (
    <section>
      {createPendingOrder?.isSuccess ? (
        <></>
      ) : (
        <section id="checkout">
          <Link href={backlink} passHref>
            <a className=" border-1 block rounded-sm border-black font-bold">
              back to cart
            </a>
          </Link>
          {stripeReturnStatus === 'cancelled' ? (
            // TODO: make into a modal or alert that can be remove from the page
            <div>
              <p>
                order incomplete, you have not been charged, you have 30 minutes
                to finish the checkout payment or the order wil be deleted and
                you will need to recreate it.
              </p>
            </div>
          ) : (
            <></>
          )}
          <h1>Review Order Before Checkout</h1>
          {/* <p>EMAIL: {customerEmail} </p> */}
          <label className="block font-bold" htmlFor="meeting-time">
            Choose a time for pickup:
          </label>
          {/* // TODO make sure datetime is in UTC like invoices date/time placed, this time is diff, if utc if removed from formatting the user sees a pickupTime */}
          {/* <input
            type="datetime-local"
            id="meeting-time"
            name="meeting-time"
            // value={order?.pickupDatetime}
            min={currentDate}
            //      2023-2-24T00:00
            // min="2023-03-24T00:00"
            // max="2018-06-14T00:00"
            // step="300"
            onChange={(e) => {
              dayjs.extend(utc)
              // console.log(e.target.value)
              // let time = e.target.value
              let time = e.target.value + ':00.000Z'

              console.log({ time })
              time = dayjs(time).toISOString()
              console.log('dayjs time', time)
              setPotentialPickupDateTime(time)
            }}
          /> */}

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

          <div>
            <h2 className="font-bold"> Cart Addresses</h2>
            <div className="md: flex flex-col rounded border-2 border-solid border-black">
              <h3 className="font-bold">Pickup Address</h3>
              <p>name: {cart?.shipperAddress?.firstName}</p>
              <p>ID Number:</p>
              <p>Address: {cart?.shipperAddress?.address}</p>
              <p>City: {cart?.shipperAddress?.city}</p>
              <p>State: {cart?.shipperAddress?.state} </p>{' '}
              <p>postal: {cart?.shipperAddress?.postalCode}</p>
              <p>cellphone: {cart?.shipperAddress?.cellphone}</p>
              <p>telephone: {cart?.shipperAddress?.telephone}</p>
            </div>
            <div className="md: flex flex-col rounded border-2 border-solid border-black">
              <h3 className="font-bold">Delivery Address</h3>
              <p>name: {cart?.recieverAddress?.firstName}</p>
              <p>ID Number:</p>
              <p>Address: {cart?.recieverAddress?.address}</p>
              <p>City: {cart?.recieverAddress?.city}</p>
              <p>State: {cart?.recieverAddress?.state} </p>{' '}
              <p>postal: {cart?.recieverAddress?.postalCode}</p>
              <p>cellphone: {cart?.recieverAddress?.cellphone}</p>
              <p>telephone: {cart?.recieverAddress?.telephone}</p>
            </div>
          </div>
          <Cart />
        </section>
      )}

      {!createPendingOrder?.isSuccess && (
        <button
          className="btn btn-blue"
          onClick={() => {
            if (pickupDate === null) {
              alert('please choose pickup Date')
              return
            }
            if (pickupTime === null) {
              alert('please choose pickup time')
              return
            }
            if (confirm('Press OK if order is ready ')) {
              createPendingOrder.mutate({
                userId: session?.user?.id,
                customerId: router.query.customerId,
                pickupDate: pickupDate,
                pickupTime: pickupTime,
              })
            }
          }}
        >
          Confirm
        </button>
      )}

      {/* {createPendingOrder?.isLoading && (
        <div role="status">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )} */}
      {/* 
      {createPendingOrder?.isSuccess && (
        <button
          className="btn btn-blue"
          onClick={() => {
            router.push(`/invoices/${createPendingOrder?.data?.id}`)
          }}
        >
          Confirm and Continue to Invoice
        </button>
      )} */}
    </section>
  )
}

export default Checkout

Checkout.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
