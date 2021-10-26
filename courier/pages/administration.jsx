import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import CreateCustomerModal from '../components/Customers/CreateCustomerModal'

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
  return (
    <Sidebar>
      <section>
        <h1>Create Users</h1>
        <CreateCustomerModal show={showModal} handleClose={handleModalClose} any={true} />

        <button className='btn add-customer-btn' onClick={() => setShowModal(true)}>
          Add User
        </button>
      </section>
    </Sidebar>
  )
}

export default Administration
