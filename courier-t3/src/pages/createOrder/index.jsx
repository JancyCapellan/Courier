import { useGlobalStore } from '@/components/globalStore'
import SenderFormAdmin from '@/components/pages/order/CreateOrder/SenderFormAdmin'
import Layout from '@/components/Layout'
import Items from '@/components/pages/order/CreateOrder/Items'

const createOrder = () => {
  const currentCustomer = useGlobalStore((state) => state.currentCustomer)
  return (
    <>
      <section className=''>
        <h1>Shipping Details</h1>
        <SenderFormAdmin currentCustomer={currentCustomer} />
        <h1>Choose Services</h1>
        <Items />
        <h1>review order</h1>
        <h1>checkout</h1>
      </section>
    </>
  )
}

export default createOrder

createOrder.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
