import { useQuery } from 'react-query'
import axios from 'axios'
import { useGlobalStore } from '../../../store/globalStore'
import { backendClient } from '../../axiosClient.mjs'

//requires access to the current customer, here i will use zustand to bring it in, will be the repsonsibilty of the componeent calling this one to supply access
const UserAddressesTable = ({ setSelectShipperAddress, handleParentModal }) => {
  const currentCustomer = useGlobalStore((state) => state.currentCustomer)

  const getCustomerAddresses = async () => {
    const { data } = await backendClient.get('user/addresses/' + currentCustomer.id)
    return data
  }
  const { data: customerAddresses, status: getCustomerAddressesStatus } = useQuery(
    'getCustomerAddresses',
    getCustomerAddresses
  )
  return (
    <>
      <section>
        {/* choose address for: {currentCustomer.firstName} {currentCustomer.lastName} */}
        <table>
          <tbody>
            <tr>
              {/* <th>Address ID</th> */}
              <th>Address Line 1</th>
              <th>Address Line 2</th>
              <th>Address Line 3</th>
              <th>City</th>
              <th>State</th>
              <th>Postal Code</th>
              <th>Country</th>
              <th>Cellphone</th>
              <th>Telephone</th>
              <th>utility</th>
            </tr>
            {getCustomerAddressesStatus == 'success' &&
              customerAddresses.map((address) => {
                return (
                  <tr className='customer-table-row' key={address.address_id}>
                    {/* <td>{address.address_id}</td> */}
                    <td>{address.address}</td>
                    <td>{address.address2}</td>
                    <td>{address.address3}</td>
                    <td>{address.city}</td>
                    <td>{address.state}</td>
                    <td>{address.postal_code}</td>
                    <td>{address.country}</td>
                    <td>{address.cellphone}</td>
                    <td>{address.telephone}</td>
                    <td>
                      {setSelectShipperAddress ? (
                        <button
                          onClick={() => {
                            console.log(address)
                            setSelectShipperAddress(address)
                            {
                              handleParentModal && handleParentModal()
                            }
                          }}
                        >
                          select
                        </button>
                      ) : (
                        <></>
                      )}
                      <button>Edit</button>
                      <button>Delete</button>
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

export default UserAddressesTable
