import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../../../contexts/cartContext'
import { useRouter } from 'next/router'

function CustomerTable({ search, setCurrentUser }) {
  const [searchResults, setSearchResults] = useState([])
  const { changeCurrentOrderUser } = useCart()
  const router = useRouter()

  // TODO: api/services/app/Customer/GetAll?Filter=m&SkipCount=0&MaxResultCount=10... going to use react table for pagination and filtering

  useEffect(() => {
    async function getCustomers() {
      try {
        let res = await axios.get(`http://localhost:3000/user/customerSearch?search=${search}`)
        if (res.status === 200) {
          // console.log('herere', res.data)
          setSearchResults(res.data)
        }
      } catch (error) {
        console.log('getcustomer', error)
      }
    }
    getCustomers(search)
    // console.log(searchResults)
  }, [search, setSearchResults])

  function openCustomerAccountPage(user) {
    router.push({
      pathname: `/customers/${user.id}`,
      query: user,
    })
    // const location = {
    //   pathname: '/customers/customeraccount',
    //   state: { user: user },
    // }
  }
  return (
    <>
      <section className='customers-table'>
        <h3>Customers</h3>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
            {searchResults.map((user) => {
              return (
                <tr className='customer-table-row' key={user.id}>
                  <td onClick={() => setCurrentUser(user)}>{user.id}</td>
                  <td onClick={() => openCustomerAccountPage(user)}>
                    {user.firstName} {user.middleName} {user.lastName}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        console.log(`move to order page with ${user.firstName} info`)
                        setCurrentUser(user)
                        changeCurrentOrderUser(user)
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
