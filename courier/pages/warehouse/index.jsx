import React from 'react'
import CustomerReactTable from '../../components/Customers/CustomerReactTable'
import KitchenSinkTable from '../../components/Tables/KitchenSinkTable'
import Layout from '../../components/Layout'
import PokemonTable from '../../components/Tables/RQ-RT'
import PickupListTable from '../../components/Tables/PickupListTable'

const Warehouse = () => {
  return (
    <section className='main-grid-area'>
      {/* <KitchenSinkTable /> */}
      {/* <CustomerReactTable /> */}
      <PickupListTable />
      <div></div>
    </section>
  )
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
