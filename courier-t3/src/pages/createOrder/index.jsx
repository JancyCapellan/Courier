import {
  useGlobalStore,
  usePersistedLocallyStore,
} from '@/components/globalStore'
import SenderFormAdmin from '@/components/pages/order/CreateOrder/SenderFormAdmin'
import Layout from '@/components/Layout'
import Items from '@/components/pages/order/CreateOrder/Items'
import Cart from '@/components/pages/order/CreateOrder/Cart'
import { useRouter } from 'next/router'
import AfterStoreHyrdation from '@/components/HOC/AfterStoreHyrdation'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import StaffTable from '@/components/pages/administration/StaffTable'
// import Checkout from './checkout'
import Link from 'next/link'
import SenderAddressForm from '@/components/pages/order/CreateOrder/orderForms/SenderAddressForm'
import RecieverAddressForm from '@/components/pages/order/CreateOrder/orderForms/RecieverAddressForm'

const CreateOrder = () => {
  const { data: session, status: sessionStatus } = useSession()
  // sessionStatus === 'authenticated' &&
  //   console.log('🚀 ~ file: index.jsx ~ line 22 ~ createOrder ~ data', session)
  const clearCart = trpc.useMutation(['cart.clearCart'], {
    onSuccess: () => {
      //refetch form and items
      // trpc.useContext
    },
  })

  const refetchCart = useGlobalStore((state) => state.refetchCart)
  const refetchCartAddresses = useGlobalStore(
    (state) => state.refetchCartAddresses
  )
  const router = useRouter()

  // not needed since any component on the route has access to query parameters
  // const setCurrentlySelectedCreateOrderCustomerId = useGlobalStore(
  //   (state) => state.setCurrentlySelectedCreateOrderCustomerId
  // )
  // setCurrentlySelectedCreateOrderCustomerId(router.query.customerId)

  // console.log(
  //   '🚀 ~ file: index.jsx ~ line 30 ~ createOrder ~ router',
  //   router.query.customerId
  // )

  return (
    <>
      <section className="">
        {sessionStatus === 'authenticated' && (
          <button
            onClick={() => {
              clearCart.mutate({
                userId: session?.user?.id,
                customerId: router?.query?.customerId,
              })
              // refetchCart()
              // refetchCartAddresses()
              router.reload()
            }}
          >
            clear entire cart
          </button>
        )}

        <h1>Shipping Details</h1>

        <SenderAddressForm />
        <RecieverAddressForm />

        {/*
        // TODO driver edits invoice, after driver confirms reciever address and item being shipper. add orderLocations table that tracks the orderItems individally, so 4 boxes of used clothes that show up as
        // 4 seperate row of item locations, each delivery package label QR code corresponds to a location entry, this way
        // packages in one order are tracked sepearlty, if one goes missing that location shouldnt be updated, and when looking under order status for a confirmed invoice
        // it wont appear as deliver in red or something */}
        <Items />
        <Cart />

        <Link href={`/createOrder/checkout/${router.query.customerId}`}>
          <button className={`btn w-auto bg-red-600`}>
            Review Order before checkout
          </button>
        </Link>
        {/* <PreCheckout /> */}
      </section>
    </>
  )
}

export default CreateOrder

CreateOrder.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
