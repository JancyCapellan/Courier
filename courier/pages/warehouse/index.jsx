import React from 'react'
import CustomerReactTable from '../../components/Customers/CustomerReactTable'
import KitchenSinkTable from '../../components/Tables/KitchenSinkTable'
import Layout from '../../components/Layout'
import PokemonTable from '../../components/Tables/RQ-RT'
import PickupListTable from '../../components/Tables/PickupListTable'
import { backendClient } from '../../components/axiosClient.mjs'
import { useQuery } from 'react-query'

const BatchContaintersTable = () => {}

const getBatchContainersDetails = () => {}

const getWarehouseSupplyInventory = () => {}

const getWarehouseDetails = async (warehouseId) => {
  const { data } = await backendClient.get('/warehouse/allwarehouseDetails')
  return data
}
const Warehouse = () => {
  const { data: warehouseDetails, isSuccess: getWarehouseDetailsIsSuccess } = useQuery(
    'getWarehouseDetails',
    getWarehouseDetails,
    {
      onSuccess: (warehouseDetails) => {
        console.log('warehouseDetails', warehouseDetails)
      },
    }
  )

  let WH
  if (getWarehouseDetailsIsSuccess) {
    WH = warehouseDetails[0]
  }
  return (
    <section className='main-grid-area'>
      {getWarehouseDetailsIsSuccess ? (
        <div>
          <h1>
            Warehouse: {WH.warehouseName} Code: {WH.warehouseCode}
          </h1>

          <table>
            <caption>Containers</caption>
            <thead>
              <tr>
                <th>ID</th>
                <th>Orders Contained</th>
                <th>Container Status</th>
              </tr>
            </thead>
            <tbody>
              {WH.containers.map((container) => {
                return (
                  <tr key={container.id}>
                    <td>{container.id}</td>
                    <td>{JSON.stringify(container.orders, undefined, 2)}</td>
                    <td>{container.status.message}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <table>
            <caption>supplies</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>count</th>
                {/* <th>price</th> */}
              </tr>
            </thead>
            <tbody>
              {WH.supplies.map((supply) => {
                return (
                  <tr key={supply.supplyName}>
                    <td>{supply.supplyName}</td>
                    <td>{supply.inventoryCount}</td>
                    {/* <td>{supply.price}</td> */}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {/* <pre>{JSON.stringify(warehouseDetails, undefined, 2)}</pre> */}
        </div>
      ) : (
        <></>
      )}
    </section>
  )
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
