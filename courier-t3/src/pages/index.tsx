import type { NextPage } from 'next'
import Head from 'next/head'
import { trpc } from '../utils/trpc'
import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../components/Formik/FormikControl'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  // const [session, loadingUser] = useSession()
  const { data: session, status } = useSession()
  const [error, setError] = useState(false)

  const router = useRouter()
  // console.log('Registered?:', router.query?.didRegister)

  // const signinRedirect = process.env.NEXT_PUBLIC_API_URL + 'account'

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>Couriers Dashboard</title>
        <meta
          name="description"
          content="webapp for shippers and courier services"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-row w-full h-16 bg-black text-white items-center mx-auto">
        The Courier Dashboard App
        <button
          className="btn btn-blue"
          onClick={() => {
            router.push('/login')
          }}
        >
          login
        </button>
      </div>
      <div className="w-screen flex flex-col items-center grow">
        <p className="align-middle">
          Courier Dashbaord is an application to handle all the needs for
          international shipping for specifically the caribean but can be
          expanded to different regions. The goal of this app was to make a
          business management app that would allow buisnesses to have a better
          online presence and have a more modern control of their buisness data.
          customers would also be able to use the application to make and check
          on their orders and account information.
        </p>
      </div>
    </div>
  )
}

export default Home
