import { useGlobalStore } from '@/components/globalStore'
import SenderFormAdmin from '@/components/pages/order/CreateOrder/SenderFormAdmin'
import Layout from '@/components/Layout'
import Items from '@/components/pages/order/CreateOrder/Items'

const createOrder = () => {
  const currentCustomer = useGlobalStore((state) => state.currentCustomer)
  return (
    <>
      <section>
        <h1>Shipping Details</h1>
        <SenderFormAdmin currentCustomer={currentCustomer} />
        <h2>Choose Services</h2>
        <Items />
        <h2>review order</h2>
        <h2>checkout</h2>
      </section>
    </>
  )
}

export default createOrder

createOrder.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
