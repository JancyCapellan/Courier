import Layout from '../../components/Layout'
import CustomerReactTable from '../../components/Customers/CustomerReactTable.jsx'
import { makeCustomerData } from '../../components/Tables/makeData.mjs'
import { backendClient } from '../../components/axiosClient.mjs'
import { useQueryClient } from 'react-query'
const postAddManyCustomer = async () => {
  try {
    const res = await backendClient.post('/customer/addManyCustomers', makeCustomerData(100))
    console.log(' added many users', res)
  } catch (error) {
    alert('error adding many customers', error)
  }
}

// test route
// const getHello = async () => {
//   try {
//     const res = await backendClient.get('/customer/getHello')
//     console.log('getHello', res)
//     alert(`server:${res.data}`)
//   } catch (error) {
//     alert('error getting hello', error)
//   }
// }
const Customers = () => {
  const queryClient = useQueryClient()

  return (
    <>
      <div className='customer-page-container'>
        <button
          onClick={() => {
            postAddManyCustomer()
            queryClient.invalidateQueries('getCustomerList')
          }}
        >
          create 100 customers
        </button>
        <CustomerReactTable />
      </div>
    </>
  )
}
export default Customers

Customers.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
