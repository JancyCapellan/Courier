import { useState } from 'react'
// import Sidebar from '../../components/Sidebar'
import RegistrationForm from '../../components/RegistrationForm.jsx'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import Layout from '../../components/Layout'

export const getStaticSideProps = async ({ res }) => {
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

  const handleModalClose = () => setShowModal(false)

  const BranchOfficeData = (branch) => {
    return (
      <section>
        <section></section>
      </section>
    )
  }

  console.log('drivers', drivers)

  function openDriverPage() {
    console.log('open driver page')
    router.push({
      pathname: `/`,
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
              <tr onClick={() => openDriverPage(driver)} key={driver.id}>
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
    <>
      <section className='BCFD'>
        <h1>Staff Manager</h1>
        <ModalContainer show={showModal} handleClose={handleModalClose}>
          <RegistrationForm staff={true} />
        </ModalContainer>

        <button className='btn add-customer-btn' onClick={() => setShowModal(true)}>
          Create Staff
        </button>
      </section>
      <Drivertable />
    </>
  )
}

export default Administration

Administration.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
