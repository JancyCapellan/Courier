import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import FormikControl from '@/components/Formik/FormikControl'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import ModalContainer from '@/components/HOC/ModalContainer'
import Layout from '@/components/Layout'
import { useQueryClient } from 'react-query'
import { trpc } from '@/utils/trpc'
import {
  useGlobalStore,
  usePersistedLocallyStore,
} from '@/components/globalStore'
import { CustomerAddresses } from '@/components/pages/customers/CustomerAddresses'
import { CustomerOrderHistory } from '@/components/pages/customers/CustomerOrderHistory'
import { CustomerAccountInfoPage } from '@/components/pages/customers/CustomerAccountInfoPage'

const CustomerAccountPage = () => {
  const router = useRouter()
  const userId = router.query.userId
  const [currentPage, setCurrentPage] = useState(1)

  //all components based on this customer object
  // const currentCustomer = usePersistedLocallyStore(
  //   (state) => state.currentCustomer
  // )

  // console.log(currentCustomer)

  const { data: user, status: getUserAccountInfoStatus } = trpc.useQuery([
    'user.getUserAccountInfo',
    { userId: userId },
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
        return <CustomerAccountInfoPage currentUser={user} />
      case 2:
        return <CustomerAddresses currentUser={user} />
      case 3:
        return <CustomerOrderHistory currentUser={user} />
      default:
        return <CustomerAccountInfoPage currentUser={user} />
    }
  }

  return (
    <>
      <h1 className="mb-4 mt-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
        Customer Account Page
      </h1>
      <section className="flex h-full flex-col items-center">
        <nav className="flex flex-row gap-4">
          <button className="btn btn-blue" onClick={() => setCurrentPage(1)}>
            Account Information
          </button>
          <button className="btn btn-blue" onClick={() => setCurrentPage(2)}>
            Addresses
          </button>
          <button className="btn btn-blue" onClick={() => setCurrentPage(3)}>
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
    </>
  )
}

export default CustomerAccountPage

CustomerAccountPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}
