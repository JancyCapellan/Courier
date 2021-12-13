import CreateCustomerOrder from '../components/CreateOrder/CreateCustomerOrder'
import axios from 'axios'

export const getServerSideProps = async ({ res }) => {
  try {
    const result = await axios.get(`http://localhost:3000/order/allProducts`)
    return {
      props: {
        products: result.data,
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

const Order = ({ products }) => {
  console.log('prodcuts', products)
  return (
    <section>
      <CreateCustomerOrder products={products} />
    </section>
  )
}
export default Order