import axios from 'axios'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../components/Formik/FormikControl'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

const StaffTable = () => {
  const router = useRouter()

  const getAllStaff = async () => {
    const { data } = await axios.get(`http://localhost:3000/user/users/getAllStaff`)
    // console.log('DRIVERS DATA', data)
    return data
  }
  const { data: staff, status } = useQuery('getAllStaff', getAllStaff, {
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
            {staff.map((staff) => {
              return (
                <tr
                  onClick={() => {
                    // console.log('staff', staff)
                    router.push({
                      pathname: `/administration/${staff.id}`,
                    })
                  }}
                  key={staff.id}
                >
                  <td>
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td></td>
                  <td>{staff.branchName}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}

export default StaffTable
