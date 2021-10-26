import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCart } from '../../../contexts/cartContext'
import { useRouter } from 'next/router'

function CustomerTable({ search, setCurrentUser, setShowEditor }) {
  //search is done with or statements in mysql wiht form entry search bar component,
  // might add component into this file
  const [searchResults, setSearchResults] = useState([])
  const { changeCurrentOrderUser } = useCart()
  const router = useRouter()
  // TODO: api/services/app/Customer/GetAll?Filter=m&SkipCount=0&MaxResultCount=10

  useEffect(() => {
    async function getCustomers() {
      try {
        let res = await axios.get(`http://localhost:3000/user/getUsers?search='${search}'`)
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
      {/* <div className='customer-manager-page'>
        <div className='customer-search'>
          <label>
            <input placeholder='search customers' onChange={handleChange}></input>
          </label>
          <button className='customer-search-btn' onClick={console.log(search)}>
            search
          </button>
        </div>
      </div> */}

      <section className='customers-table'>
        <h3>Customers</h3>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
            {searchResults.map((item) => {
              return (
                <tr className='customer-table-row' key={item.id}>
                  <td onClick={() => setCurrentUser(item)}>{item.id}</td>
                  <td onClick={() => openCustomerAccountPage(item)}>
                    {item.first_name} {item.middle_name} {item.last_name}
                  </td>
                  {/* <td>
                    <button
                      onClick={() => {
                        setCurrentUser(item)
                        setShowEditor(true)
                      }}
                    >
                      edit
                    </button>
                  </td> */}
                  <td>
                    <button
                      onClick={() => {
                        console.log(`move to order page with ${item.first_name} info`)
                        setCurrentUser(item)
                        changeCurrentOrderUser(item)
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
