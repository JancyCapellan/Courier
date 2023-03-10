import { useState, useEffect } from 'react'
// import Sidebar from '../../components/Sidebar'
import RegistrationFormModal from '@/components/RegistrationFormModal.jsx'
import ModalContainer from '@/components/HOC/ModalContainer'
import Layout from '@/components/Layout'
import ProductEditorTable from '@/components/pages/administration/ProductEditorTable.jsx'
import StaffTable from '@/components/pages/administration/StaffTable.jsx'

// TODO: status and data of ongoing business operations
const Administration = () => {
  return (
    <>
      <section className="administration-container">
        <h1>Product Administration</h1>
        <section className="flex flex-row justify-center bg-slate-400 ">
          <ProductEditorTable />
        </section>

        <h1>Warehose Administration</h1>
        {/* select current warehouse  dropdown  */}
        {/* TODO: create, delete, list, edit warehouse information */}
      </section>
    </>
  )
}

export default Administration

Administration.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
