import React from 'react'
import Layout from '../../components/Layout'

const Warehouse = () => {
  return <section className='main-grid-area'>Warehouse</section>
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
