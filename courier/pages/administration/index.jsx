import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import RegistrationForm from '../../components/RegistrationForm.jsx'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import { useRouter } from 'next/router'

export const getServerSideProps = async ({ res }) => {
  try {
    const result = await axios.post(`http://localhost:3000/user/allDrivers`)
    console.log('response', result.data)
    return {
      props: {
        drivers: result.data,
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

const Administration = ({ drivers }) => {
  const [branch, setBranch] = useState()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleModalClose = () => setShowModal(false)

  const BranchOfficeData = (branch) => {
    return (
      <section>
        <section></section>
      </section>
    )
  }

  console.log('drivers', drivers)

  function openDriverPage(driverId) {
    console.log('open driver page')
    router.push({
      pathname: `/administration/${driverId}`,
    })
  }

  const Drivertable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>driver name</th>
            <th>packages assigned today</th>
            <th>branch name</th>
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
    )
  }

  return (
    <Sidebar>
      <section>
        <h1>Staff Manager</h1>
        <ModalContainer show={showModal} handleClose={handleModalClose}>
          <RegistrationForm staff={true} />
        </ModalContainer>

        <button className='btn add-customer-btn' onClick={() => setShowModal(true)}>
          Create Staff
        </button>
      </section>
      <Drivertable />
    </Sidebar>
  )
}

export default Administration
