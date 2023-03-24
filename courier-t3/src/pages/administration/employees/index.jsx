import Layout from '@/components/Layout'
import StaffTable from '@/components/pages/administration/StaffTable.jsx'
import RegistrationFormModal from '@/components/RegistrationFormModal.jsx'
import ModalContainer from '@/components/HOC/ModalContainer'
import { useState } from 'react'

const Employees = () => {
  const [showModal, setShowModal] = useState(false)

  const handleModalClose = () => setShowModal(false)
  return (
    <>
      <section>
        <button className="btn btn-blue" onClick={() => setShowModal(true)}>
          Create Staff
        </button>
        <h1>ADMINS</h1>
        <hr />
        <h1>warehouse </h1>
        <hr />
        <h1>drivers</h1>

        <ModalContainer show={showModal} handleClose={handleModalClose}>
          <RegistrationFormModal
            isRegisteringStaff={true}
            closeModal={handleModalClose}
          />
        </ModalContainer>

        <StaffTable />
      </section>
    </>
  )
}

export default Employees

Employees.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
