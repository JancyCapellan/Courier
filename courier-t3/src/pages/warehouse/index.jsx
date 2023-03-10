import Layout from '@/components/Layout'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

const Warehouse = () => {
  //function to scan qrcode/add container id number to open a container for filling
  const createNewContainer = trpc.useMutation([''])

  const router = useRouter()

  return (
    // tables showing the orders seperated by warehouse and make reports on those orders by warehouse daily
    <section>
      <h1>Warehouse</h1>
      <div className="flex flex-col gap-2 bg-gray-200 w-max items-center">
        <button
          className="btn btn-blue w-max hover:bg-red-300"
          onClick={() => {
            router.push({ pathname: 'warehouse/containers' })
          }}
        >
          checkin new batch container
        </button>
        {/* <button className="btn btn-blue w-max hover:bg-red-300">
          create new container
        </button> */}
        <button className="btn btn-blue w-max hover:bg-red-300">
          scan a package
        </button>
      </div>

      <div>Containers</div>
    </section>
  )
}

export default Warehouse

Warehouse.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
