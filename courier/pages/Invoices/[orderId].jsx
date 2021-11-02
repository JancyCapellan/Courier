import Sidebar from '../../components/Sidebar'
import { useRouter } from 'next/router'

export const getServerSideProps = async ({ res }) => {
  try {
    const result = await axios.get(`http://localhost:3000/order/allOrders`)
    console.log('response', result.data)
    return {
      props: {
        listOfInvoices: result.data,
      },
    }
  } catch (error) {
    res.statusCode = 500
    console.log('getcustomer', error)
    return {
      props: {},
    }
  }
}

const InvoicePage = () => {
  const router = useRouter()
  const orderId = router.query.orderId
  return (
    <Sidebar>
      <h1>test</h1>
      <div>{orderId}</div>
    </Sidebar>
  )
}

export default InvoicePage
