import Layout from '@/components/Layout'
import { trpc } from '@/utils/trpc'

const Warehouse = () => {
  //function to scan qrcode/add container id number to open a container for filling
  const createNewContainer = trpc.useMutation([''])

  return (
    // tables showing the orders seperated by warehouse and make reports on those orders by warehouse daily
    <section>
      <h1>Warehouse</h1>
      <div className="flex flex-col gap-2">
        <button
          className="btn btn-blue w-max hover:bg-red-300"
          onClick={() => {}}
        >
          Checking new batch container
        </button>
        <button className="btn btn-blue w-max hover:bg-red-300">
          scan a package
        </button>
      </div>
    </section>
  )
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
