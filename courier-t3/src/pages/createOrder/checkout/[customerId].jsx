//@ts-nocheck
import Layout from '@/components/Layout'
import Cart from '@/components/pages/order/CreateOrder/Cart'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CreateOrder from '..'

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

  // * NOTE: the cart is based on user and customer id, if the user logged in is the customer making the order it is the same and their cart should show. if its a staff member making an order for someone even if they go to the checkout page for that customer it will be a different cart showing since its the staff making the order. if i want to see the customers current cart, i will need to adda seperate section. therortically, i could make it so /createOrder/checkout/[customerId] means that the checkout for that customer, but that might restrict to having one checkouot per customer, right now a customer can be making a order and an admin can also make them an order, the customer may be saving their order for later
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
  const clearCart = trpc.useMutation(['cart.clearCart'])

  const createPendingOrder = trpc.useMutation(
    ['cart.createPendingOrderBeforeCheckoutCompletes'],
    {
      onSuccess: (data) => {
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

  // TODO: change pending status to include the type of payment waiting, stripe/cash/check/quickpay. and partial pending, (partial payments not yet implemented)
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

  //if admin get customerEmail, if customer used currentEmail
  const { data: customerEmail } = trpc.useQuery(
    ['user.getUserEmail', { userId: router?.query?.customerId }],
    {
      // enabled: sessionStatus === 'authenticated' && !!router.query.customerId,
      onSuccess: (d) => {
        // console.log(d)
      },
    }
  )

  // changing for webhook that will let me checkk fo rehckout.session.expired in where i will delete from the data, this way i can set a configurable amount of time for the session to expire, maybe part of the base configs for projects that i have been thinking of that would set basic settings based on the prefernces of the tenant/client
  // useEffect(() => {
  //   if (router.query.stripe === 'cancelled') {

  // i cant not get the checkoutsessionID in the cancelURl because it is created
  // TODO: remove pending order that was just attempted?
  // const session = await stripe.checkout.sessions.expire(
  //   'cs_test_a1RtHP00RsUvDWVdtnLG0xshpb5hMsTy8gB6vYlHLIU4CGHOtwo54Z1RTp'
  // )
  // then remove same order from local database
  //     console.log('pending orders remvoved')
  //   }
  // }, [router])

  if (sessionStatus === 'loading' || cartStatus === 'loading')
    return <div>Loading...</div>

  const stripeReturnStatus = router.query?.stripe

  const backlink = `/createOrder?customerId=${router.query?.customerId}`

  let currentDate = getCurrentDate()
  return (
    <section>
      <Link href={backlink} passHref>
        <a className=" border-1 block rounded-sm border-black font-bold">
          back to cart
        </a>
      </Link>
      {stripeReturnStatus === 'cancelled' ? (
        // TODO: make into a modal or alert that can be remove from the page
        <div>
          <p>
            order incomplete, you have not been charged, you have 30 minutes to
            finish the checkout payment or the order wil be deleted and you will
            need to recreate it.
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
      {/* // TODO test on IOS may have to change to two INPUTS for DATE and TIME */}
      <input
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
          console.log(e.target.value)
          let time = e.target.value + ':00.000Z'
          setPotentialPickupDateTime(time)
        }}
      />
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
      {/* // TODO: change payment flow for admins/staff for customer orders with stripe. might have to do with partial payments  */}
      <div className="flex flex-row">
        {/* <p>proceed to payment</p> */}
        {/* make sessions and stuff on databasem, just send the link to the stripe chkout page  */}
        <button
          className="btn btn-blue"
          onClick={() => {
            if (potentialPickupDateTime === null) {
              alert('please choose pickup time')
              return
            }
            // note: Using the asPath field may lead to a mismatch between client and server if the page is rendered using server-side rendering or automatic static optimization. Avoid using asPath until the isReady field is true.
            if (confirm('Press OK if order is ready ')) {
              if (router.isReady) {
                console.log('WTF')
                createCheckoutSession.mutate({
                  userId: session?.user?.id,
                  customerId: router.query.customerId,
                  redirectUrl: router.asPath,
                  customerEmail: customerEmail.email,
                })
              } else {
                // TODO: change to modal/toast, maybe crossplatorm issue
                alert('try again, router wasnt ready')
              }
            }
          }}
        >
          stripe checkout
        </button>

        <p>partial payments? click here and enter amount to be paid now: </p>
        <button
          className="btn btn-blue"
          onClick={() => {
            if (potentialPickupDateTime === null) {
              alert('please choose pickup time')
              return
            }

            if (confirm('Press OK if order is ready '))
              createPendingOrderWrapper('CASH')
          }}
        >
          cash
        </button>
        <button
          className="btn btn-blue"
          onClick={() => {
            if (potentialPickupDateTime === null) {
              alert('please choose pickup time')
              return
            }
            if (confirm('Press OK if order is ready '))
              createPendingOrderWrapper('CHECK')
          }}
        >
          check
        </button>

        <button
          className="btn btn-blue"
          onClick={() => {
            if (potentialPickupDateTime === null) {
              alert('please choose pickup time')
              return
            }
            if (confirm('Press OK if order is ready '))
              createPendingOrderWrapper('QUICKPAY')
          }}
        >
          quickpay
        </button>
      </div>
    </section>
  )
}

export default Checkout

Checkout.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
