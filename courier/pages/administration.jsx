import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import RegistrationForm from '../components/RegistrationForm.jsx'
import ModalContainer from '../components/HOC/ModalContainer'

const Administration = () => {
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

  const Drivertable = () => {
    return (
      <table>
        <thead>
          <th>driver name</th>
          <th>packages assigned today</th>
          <th>branch name</th>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
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
