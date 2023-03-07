//@ts-nocheck
import Layout from '@/components/Layout'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CreateOrder from '..'

// review cart order, addresses, and items, and proceed to stripe checkout and creating an invoice for the order
const Checkout = () => {
  const router = useRouter()
  // console.log('🚀 ~ file: checkout.jsx ~ line 10 ~ Checkout ~ router', router)

  useEffect(() => {
    if (router.query.stripe === 'cancelled') {
      // remove pending order that was just attempted?
      console.log('pending orders remvoved')
    }
  }, [router])

  const { data: session, status: sessionStatus } = useSession()

  // TODO: (see forms below) change returned object of data: cart to have explicit addresses, rn it is just explected that index 0 is shipper customer and index 1 is recieving person

  // * NOTE: the cart is based on user and customer id, if the user logged in is the customer making the order it is the same and their cart should show. if its a staff member making an order for someone even if they go to the checkout page for that customer it will be a different cart showing since its the staff making the order. if i want to see the customers current cart, i will need to adda seperate section. therortically, i could make it so /createOrder/checkout/[customerId] means that the checkout for that customer, but that might restrict to having one checkouot per customer, right now a customer can be making a order and an admin can also make them an order, the customer may be saving their order for later

  // TODO: add save current order for later)

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
      onSucess: async () => {
        clearCart.mutateAsync({
          userId: session?.user?.id,
          customerId: router.query.customerId,
        })
      },
    }
  )

  async function createPendingOrderWrapper(paymentType) {
    await createPendingOrder.mutateAsync({
      userId: session?.user?.id,
      customerId: router.query.customerId,
      paymentType: paymentType,
    })

    //router.reload()
    if (session.user.role === 'CUSTOMER') {
      //TODO: SEPERATE account components page by routes
      router.push('/account')
    } else {
      router.push('/Invoices')
    }
  }

  const createCheckoutSession = trpc.useMutation(
    ['stripe.createCheckoutSession'],
    {
      onSuccess: (stripeCheckoutSession) => {
        console.log('Stripe Checkout Session', stripeCheckoutSession)
        // create status pending order with checkoutSession, but what if checkout session isnt completed? left with an order that is pending in stripe and i could remove with a stripe webhook after expiration.

        // creates pending status for newly created order while it waits to be paid.
        // TODO: change pending status to include the type of payment waiting, stripe/cash/check/quickpay. and partial pending, (partial payments not yet implemented)
        createPendingOrder.mutate({
          userId: session?.user?.id,
          customerId: router.query.customerId,
          stripeCheckoutId: stripeCheckoutSession.id,
          paymentType: 'CARD',
        })

        if (stripeCheckoutSession.url) router.push(stripeCheckoutSession.url)
      },
    }
  )

  if (sessionStatus === 'loading' || cartStatus === 'loading')
    return <div>Loading...</div>

  const stripeReturnStatus = router.query?.stripe

  let backlink = `/createOrder?customerId=${router.query?.customerId}`
  return (
    <section>
      <Link href={backlink}>back to cart</Link>

      {stripeReturnStatus === 'cancelled' ? (
        // TODO: make into a modal or alert that can be remove from the page
        <div>
          <p>
            checkhout payment cancelled, order still incomplete, you have not
            been charged, head back to cart to make changes, if this wasnt an
            accident
          </p>
        </div>
      ) : (
        <></>
      )}
      <h1>Review Order Before Checkout</h1>

      <div>
        <h2>addresses</h2>
        <div className="flex flex-col md: border-solid rounded border-2 border-black">
          <h3>shipper</h3>
          <p>name: {cart?.addresses[0]?.firstName}</p>
          <p>ID Number:</p>
          <p>Address: {cart?.addresses[0]?.address}</p>
          <p>City: {cart?.addresses[0]?.city}</p>
          <p>State: {cart?.addresses[0]?.state} </p>{' '}
          <p>postal: {cart?.addresses[0]?.postalCode}</p>
          <p>cellphone: {cart?.addresses[0]?.cellphone}</p>
          <p>telephone: {cart?.addresses[0]?.telephone}</p>
        </div>
        <div className="flex flex-col md: border-solid rounded border-2 border-black">
          <h3>reciever</h3>
          <p>name: {cart?.addresses[1]?.firstName}</p>
          <p>ID Number:</p>
          <p>Address: {cart?.addresses[1]?.address}</p>
          <p>City: {cart?.addresses[1]?.city}</p>
          <p>State: {cart?.addresses[1]?.state} </p>{' '}
          <p>postal: {cart?.addresses[1]?.postalCode}</p>
          <p>cellphone: {cart?.addresses[1]?.cellphone}</p>
          <p>telephone: {cart?.addresses[1]?.telephone}</p>
        </div>
      </div>

      <section>
        <h2>Item list</h2>
        {cart?.items.map((item) => {
          // console.log('item,', item)
          return (
            <div key={item.product.name} className="border- border-2 rounded ">
              <p>item: {item.product.name}</p>
              <p> qty: {item.quantity}</p>
            </div>
          )
        })}
      </section>

      {/* // TODO: change payment flow for admins/staff for customer orders with stripe. might have to do with partial payments  */}
      <div className="flex flex-row">
        {/* <p>proceed to payment</p> */}
        {/* make sessions and stuff on databasem, just send the link to the stripe chkout page  */}
        <button
          className="btn btn-blue"
          onClick={() => {
            // note: Using the asPath field may lead to a mismatch between client and server if the page is rendered using server-side rendering or automatic static optimization. Avoid using asPath until the isReady field is true.
            if (router.isReady) {
              createCheckoutSession.mutate({
                userId: session?.user?.id,
                customerId: router.query.customerId,
                redirectUrl: router.asPath,
              })
            } else {
              // TODO: change to modal, maybe crossplatorm issue
              alert('try again, router wasnt ready')
            }
          }}
        >
          stripe checkout
        </button>

        <p>partial payments? click here and enter amount to be paid now: </p>
        <button
          className="btn btn-blue"
          onClick={() => {
            createPendingOrderWrapper('CASH')
          }}
        >
          cash
        </button>
        <button
          className="btn btn-blue"
          onClick={() => {
            createPendingOrderWrapper('CHECK')
          }}
        >
          check
        </button>

        <button
          className="btn btn-blue"
          onClick={() => {
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
