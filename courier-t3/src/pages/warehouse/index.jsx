import Layout from '@/components/Layout'
import FancyTable from '@/components/Tables/FancyTable'
import PickupListTable from '@/components/Tables/PickupListTable'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'

const Warehouse = () => {
  //function to scan qrcode/add container id number to open a container for filling
  const createNewBatchNumber = trpc.useMutation([''])

  const router = useRouter()

  // TODO created a default warehouse choice for admin whom can be at multiple warehouses, drivers, staff, only see the warehouse that they associate with.
  const [selectedWarehouse, setSelectedWarehouse] = useState('bronx')

  const columns = useMemo(
    () => [
      {
        Header: 'Warehouse',
        accessor: 'warehouse',
      },
      {
        Header: 'Total Packages',
        accessor: 'totalPackages',
      },
      {
        Header: 'Batch Containers',
        accessor: '',
      },
    ],
    []
  )

  return (
    // tables showing the orders seperated by warehouse and make reports on those orders by warehouse daily
    <section>
      <label htmlFor="warehouse-select">
        Select Warehouse:
        <select
          value={selectedWarehouse}
          onChange={(e) => {
            setSelectedWarehouse(e.target.value)
          }}
          id="warehouse-select"
          className="w-max"
        >
          {['bronx', 'miami', 'santiago'].map((warehouse) => (
            <option key={warehouse} value={warehouse}>
              {warehouse}
            </option>
          ))}
        </select>
      </label>
      <h1>{selectedWarehouse} Warehouse</h1>
      <hr className="mx-2 my-2"></hr>
      <div className="flex w-max flex-col items-center gap-2 bg-gray-200">
        <button className="btn btn-blue w-max hover:bg-red-300">
          create New Batch Number
        </button>
        {/* <button
          className="btn btn-blue w-max hover:bg-red-300"
          onClick={() => {
            router.push({ pathname: 'warehouse/containers' })
          }}
        >
          checkin new batch container
        </button> */}
        {/* <button className="btn btn-blue w-max hover:bg-red-300">
          create new container
        </button> */}
        <button className="btn btn-blue w-max hover:bg-red-300">
          scan a package
        </button>
      </div>
      <div>Containers</div>
      {/* per warehouse seelected, show a list of the pacakges at that warehouse,
      and the batch container they are in,
      <FancyTable
        columns={columns}
        data={[
          { warehouse: 'bronx', totalPackages: '3' },
          { warehouse: 'bronx' },
          { warehouse: 'bronx' },
        ]}
      /> */}
      {/* <PickupListTable /> */}
    </section>
  )
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
