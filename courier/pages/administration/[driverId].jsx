import React from 'react'
import Sidebar from '../../components/Sidebar'
import axios from 'axios'
import { useRouter } from 'next/router'

export async function getStaticPaths() {
  const result = await axios.post(`http://localhost:3000/user/allDrivers`)
  console.log('response', result.data)

  const paths = result.data.map((driver) => ({
    params: { driverId: driver.id },
  }))

  // fallback: false means pages that don’t have the
  // correct id will 404.
  return { paths, fallback: false }
}

export const getStaticProps = async ({ params, res }) => {
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
    <>
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
          <caption>Today`&apos;`s List</caption>
          <tr>
            <th>order number</th>
            <th> customer name</th>
            <th>customer address</th>
          </tr>
        </table>
      </section>
    </>
  )
}

export default DriverAccountPage

DriverAccountPage.getLayout = function getLayout(page) {
  return <Sidebar>{page}</Sidebar>
}
