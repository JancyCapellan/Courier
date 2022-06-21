import React from 'react'
import KitchenSinkTable from '../../components/kitchenSinkTable'
import Layout from '../../components/Layout'

const Warehouse = () => {
  return (
    <section className='main-grid-area'>
      {/* <KitchenSinkTable /> */}
      <div></div>
    </section>
  )
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
