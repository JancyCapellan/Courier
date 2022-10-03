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

const createOrder = () => {
  const currentCustomer = usePersistedLocallyStore(
    (state) => state.currentCustomer
  )

  const router = useRouter()

  const cu = router.query.customerId
  return (
    <>
      <section className="">
        <h1>Shipping Details</h1>
        <SenderFormAdmin currentCustomer={currentCustomer} />
        <h1>Choose Services</h1>
        <Items />
        <h1>review order</h1>
        <Cart />
        <h1>checkout</h1>
      </section>
    </>
  )
}

export default createOrder

createOrder.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
