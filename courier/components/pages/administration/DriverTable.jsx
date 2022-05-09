import axios from 'axios'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../components/Formik/FormikControl'
import { useQuery } from 'react-query'

const DriverTable = () => {
  const getDrivers = async () => {
    const { data } = await axios.post(`http://localhost:3000/user/allDrivers`)
    // console.log('DRIVERS DATA', data)
    return data
  }
  const { data: drivers, status } = useQuery('getDrivers', getDrivers, {
    onSuccess: (data) => {},
    onError: (error) => {
      console.log('error fetching product types', error)
    },
  })

  return (
    <>
      {status === 'loading' && <div>loading</div>}
      {status === 'success' && (
        <table>
          <thead>
            <tr>
              <th>Driver Name</th>
              <th>Packages Assigned Today</th>
              <th>Affliated Branch</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => {
              return (
                <tr onClick={() => openDriverPage(driver.id)} key={driver.id}>
                  <td>
                    {driver.firstName} {driver.lastName}
                  </td>
                  <td></td>
                  <td>{driver.branchName}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}

export default DriverTable
