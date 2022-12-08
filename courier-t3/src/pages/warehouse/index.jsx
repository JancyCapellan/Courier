import Layout from '@/components/Layout'

const Warehouse = () => {
  return (
    // tables showing the orders seperated by warehouse and make reports on those orders by warehouse daily
    <section>
      <h1>Warehouse</h1>
    </section>
  )
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
