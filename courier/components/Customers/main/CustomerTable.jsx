import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../../../contexts/cartContext'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { useGlobalStore } from '../../../store/globalStore'

function CustomerTable({ search }) {
  // const [searchResults, setSearchResults] = useState([])
  // const { changeCurrentOrderUser } = useCart()

  const setCurrentCustomer = useGlobalStore((state) => state.setCurrentCustomer)
  const router = useRouter()

  const getCustomerList = async () => {
    const { data } = await axios.get(`http://localhost:3000/user/customerSearch?search=${search}`)
    return data
  }
  const { data: customerList, status: getCustomerListStatus } = useQuery(
    'getCustomerList',
    getCustomerList
  )

  function openCustomerAccountPage(user) {
    switch (user.role) {
      case 'DRIVE':
        console.log('userId', user.id)
        //make different account pages for roles
        router.push({
          pathname: `/customers/${user.id}`,
        })

      default:
        router.push({
          pathname: `/customers/${user.id}`,
        })
    }

    // const location = {
    //   pathname: '/customers/customeraccount',
    //   state: { user: user },
    // }
  }
  return (
    <>
      <section className='customers-table'>
        {/* <h3>Customers</h3> */}
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
            {getCustomerListStatus === 'success' &&
              customerList?.map((customer) => {
                return (
                  <tr
                    className='customer-table-row'
                    onClick={() => {
                      setCurrentCustomer(customer)
                    }}
                    key={customer.id}
                  >
                    <td>{customer.id}</td>
                    <td onClick={() => openCustomerAccountPage(customer)}>
                      {customer.firstName} {customer.middleName} {customer.lastName}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          console.log(`move to order page with ${customer.firstName} info`)
                          // setCurrentUser(user)
                          // setCurrentCustomer(customer)

                          // changeCurrentOrderUser(customer)
                          router.push({
                            pathname: `/order`,
                          })
                        }}
                      >
                        order
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default CustomerTable
