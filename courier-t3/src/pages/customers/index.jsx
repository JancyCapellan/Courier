//@ts-nocheck

import Layout from '../../components/Layout'
import CustomerReactTable from '../../components/pages/customers/CustomerReactTable.jsx'
// import { makeCustomerData } from '@/components/Tables/makeData.mjs'
import { useQueryClient, useMutation } from 'react-query'

// const postAddManyCustomer = async () => {
//   try {
//     const res = await backendClient.post(
//       '/customer/addManyCustomers',
//       makeCustomerData(5)
//     )
//     console.log(' added many users', res)
//   } catch (error) {
//     alert('error adding many customers', error)
//   }
// }

const Customers = () => {
  const queryClient = useQueryClient()

  return (
    <>
      <div className="customer-page-container">
        {/* <button
          onClick={() => {
            postAddManyCustomer()
            queryClient.invalidateQueries('getCustomerList')
          }}
        >
          create 5 customers
        </button> */}
        <CustomerReactTable />
      </div>
    </>
  )
}
export default Customers

Customers.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
