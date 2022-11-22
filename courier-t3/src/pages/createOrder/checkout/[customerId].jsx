//@ts-nocheck
import Layout from '@/components/Layout'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import createOrder from '..'

// review cart order, addresses, and items, and proceed to stripe checkout and creating an invoice for the order
const Checkout = () => {
  const router = useRouter()
  // console.log('🚀 ~ file: checkout.jsx ~ line 10 ~ Checkout ~ router', router)

  const { data: session, status: sessionStatus } = useSession()

  // TODO: change returned object to have explicit addresses, rn it is just explected that index 0 is shipper customer and index 1 is recieving person
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

  const createPendingOrder = trpc.useMutation([
    'cart.createPendingOrderBeforeCheckoutCompletes',
  ])

  const createCheckoutSession = trpc.useMutation(
    ['stripe.createCheckoutSession'],
    {
      onSuccess: (stripeCheckoutSession) => {
        console.log(
          '#### ~ file: checkout.jsx ~ line 38 ~ Checkout ~ stripCheckoutSession',
          stripeCheckoutSession
        )
        // create status pending order with checkoutSession, but what if checkout session isnt completed? left with an order that is pending and i could remove with a webhook after expiratio. or i could

        createPendingOrder.mutate({
          userId: session?.user?.id,
          customerId: router.query.customerId,
          stripeCheckoutId: stripeCheckoutSession.id,
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
            <div
              key={item.product.stripeProductId}
              className="border- border-2 rounded "
            >
              <p>item: {item.product.name}</p>
              <p> qty: {item.quantity}</p>
            </div>
          )
        })}
      </section>

      <div className="flex flex-row">
        {/* <p>proceed to payment</p> */}
        {/* make sessions and stuff on databasem, just send the link to the stripe chkout page  */}
        <button
          className="btn btn-blue"
          onClick={() => {
            // Using the asPath field may lead to a mismatch between client and server if the page is rendered using server-side rendering or automatic static optimization. Avoid using asPath until the isReady field is true.
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
          pay online
        </button>

        {/* TODO: after click, cart is add to orderTable and paymentType is updated to cash */}
        <button className="btn btn-blue">pay in cash</button>
      </div>
    </section>
  )
}
export default Checkout

Checkout.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
