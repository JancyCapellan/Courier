import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import ModalContainer from '@/components/HOC/ModalContainer'
import Layout from '@/components/Layout'
import { useQueryClient } from 'react-query'
import { trpc } from '@/utils/trpc'
import { useGlobalStore } from '@/components/globalStore'
import { CustomerAddresses } from '@/components/pages/customers/CustomerAddresses'
import { CustomerOrderHistory } from '@/components/pages/customers/CustomerOrderHistory'
import { CustomerEditorForm } from '@/components/pages/customers/CustomerEditorForm'

const CustomerAccountPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const [currentPage, setCurrentPage] = useState(1)

  const currentCustomer = useGlobalStore((state) => state.currentCustomer)

  console.log(currentCustomer)

  const { data: user, status: getUserAccountInfoStatus } = trpc.useQuery([
    'user.getUserAccountInfo',
    { userId: currentCustomer.id },
  ])

  //    try {
  //    const data = await queryClient.fetchQuery(queryKey, queryFn)
  //  } catch (error) {
  //    console.log(error)
  //  }

  console.log('current User', user)

  function ComponentSwitcher({ user }) {
    switch (currentPage) {
      case 1:
        return <CustomerEditorForm currentUser={user} />
      case 2:
        return <CustomerAddresses currentUser={user} />
      case 3:
        return <CustomerOrderHistory currentUser={user} />
      default:
        return <CustomerEditorForm currentUser={user} />
    }
  }

  return (
    <section className='flex flex-col items-center h-full'>
      <h1 className='mb-4 mt-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl'>
        Customer Account Page
      </h1>
      <nav className='flex flex-row gap-4'>
        <button className='btn btn-blue' onClick={() => setCurrentPage(1)}>
          Account Information
        </button>
        <button className='btn btn-blue' onClick={() => setCurrentPage(2)}>
          Addresses
        </button>
        <button className='btn btn-blue' onClick={() => setCurrentPage(3)}>
          Order History
        </button>
      </nav>
      <br />
      {getUserAccountInfoStatus === 'success' ? (
        <ComponentSwitcher user={user} />
      ) : (
        <></>
      )}
      <br />
    </section>
  )
}

export default CustomerAccountPage

CustomerAccountPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
