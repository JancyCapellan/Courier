import { useState, useEffect } from 'react'
// import Sidebar from '../../components/Sidebar'
import RegistrationFormModal from '@/components/RegistrationFormModal.jsx'
import ModalContainer from '@/components/HOC/ModalContainer'
import Layout from '@/components/Layout'
import ProductEditorTable from '@/components/pages/administration/ProductEditorTable.jsx'
import StaffTable from '@/components/pages/administration/StaffTable.jsx'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import * as Yup from 'yup'
import { trpc } from '@/utils/trpc'

// TODO: status and data of ongoing business operations
const Administration = () => {
  const newWarehouseMutation = trpc.useMutation(['warehouse.createWarehouse'], {
    onSuccess: () => console.log('created new warehouse'),
    onError: () => console.log('error creating new warehouse '),
  })

  const { data: allWarehouses, status: allWarehousesStatus } = trpc.useQuery([
    'warehouse.getAllWarehouses',
  ])

  const deleteWarehouseMutation = trpc.useMutation([
    'warehouse.deleteWarehouse',
  ])

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

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Warehouse</th>
              <th>CodeName</th>
              <th>utility</th>
            </tr>
          </thead>
          <tbody>
            {allWarehousesStatus === 'success' &&
              allWarehouses.map((warehouse) => {
                return (
                  <tr key={warehouse.id}>
                    <td>{warehouse.id}</td>
                    <td>{warehouse.name}</td>
                    <td>{warehouse.codeName}</td>
                    <td>
                      {/* <button
                        onClick={() =>
                          deleteWarehouseMutation.mutate({
                            warehouseId: warehouse.id,
                          })
                        }
                      >
                        delete warehouse
                      </button> */}
                      <button>details page</button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        <div className="bg-gray-50">
          <h2 className="m-2 font-bold text-black underline">
            Create New Warehouse{' '}
          </h2>
          <Formik
            initialValues={{
              name: '',
              codeName: '',
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .min(3, 'must be at least 3 characters long')
                .required('please enter item name'),
              codeName: Yup.string()
                .min(2, 'must be at least 2 characters long')
                .required('please enter CodeName'),
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                newWarehouseMutation.mutate(values)
                resetForm()
              } catch (error) {
                // console.log(error)
                alert('error adding item. please make sure type is selected')
                return 500
              }
              // setSubmitting(false)
            }}
          >
            {(formik) => {
              return (
                <Form className="">
                  <FormikControl
                    control="input"
                    type="text"
                    label="Warehouse Name"
                    name="name"
                    className=""
                  />
                  <FormikControl
                    control="input"
                    type="text"
                    label="Code Name"
                    name="codeName"
                    className=""
                  />
                  <button
                    className="btn btn-blue"
                    type="submit"
                    disabled={!formik.isValid}
                  >
                    Submit
                  </button>
                </Form>
              )
            }}
          </Formik>
        </div>
      </section>
    </>
  )
}

export default Administration

Administration.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
