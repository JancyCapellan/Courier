import React from 'react'
import CustomerReactTable from '../../components/Customers/CustomerReactTable'
import KitchenSinkTable from '../../components/Tables/KitchenSinkTable'
import Layout from '../../components/Layout'
import PokemonTable from '../../components/Tables/RQ-RT'
import PickupListTable from '../../components/Tables/PickupListTable'

const BatchContaintersTable = () => {}

const Warehouse = () => {
  return (
    <section className='main-grid-area'>
      <h1> Batch Containers</h1>
      <h1> Warehouse Supply Inventory</h1>
    </section>
  )
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
