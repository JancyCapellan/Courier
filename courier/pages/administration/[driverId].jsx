import React from 'react'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'
import { useRouter } from 'next/router'

export const getServerSideProps = async ({ params, res }) => {
  const { driverId } = params
  try {
    const result = await axios.get(`http://localhost:3000/user/${driverId}`)
    return {
      props: {
        driver: result.data,
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

const DriverAccountPage = ({ driver }) => {
  const router = useRouter()

  return (
    <Sidebar>
      <section>
        <h1>Driver Account</h1>
        <pre>
          <button
            onClick={() =>
              router.push({
                pathname: `/customers/${driver.id}`,
              })
            }
          >
            Edit Driver Account information
          </button>
          Name: {driver.firstName} {driver.lastName}
        </pre>
        <h2>pickups</h2>
        <table>
          <caption>Today's List</caption>
          <tr>
            <th>order number</th>
            <th> customer name</th>
            <th>customer address</th>
          </tr>
        </table>
      </section>
    </Sidebar>
  )
}

export default DriverAccountPage
