import { useState, useEffect } from 'react'
// import Sidebar from '../../components/Sidebar'
import RegistrationForm from '../../components/RegistrationForm.jsx'
import ModalContainer from '../../components/HOC/ModalContainer'
import axios from 'axios'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../components/Formik/FormikControl'
import Layout from '../../components/Layout'
import { useQuery } from 'react-query'
import ProductEditorTable from '../../components/pages/administration/ProductEditorTable.jsx'
import DriverTable from '../../components/pages/administration/DriverTable.jsx'

const Administration = () => {
  const [branch, setBranch] = useState()
  const [showModal, setShowModal] = useState(false)

  const handleModalClose = () => setShowModal(false)

  return (
    <>
      <section className='administration-container'>
        <h1>Staff Manager</h1>
        <button className='btn-31' onClick={() => setShowModal(true)}>
          Create Staff
        </button>
        <ModalContainer show={showModal} handleClose={handleModalClose}>
          <RegistrationForm staff={true} />
        </ModalContainer>

        <DriverTable />

        <h1>Product manager</h1>
        <section className='product-manager-container'>
          <ProductEditorTable />
        </section>
      </section>
    </>
  )
}

export default Administration

Administration.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
