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
        <SenderFormAdmin />
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
