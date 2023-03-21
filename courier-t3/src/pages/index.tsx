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
import { getLogger } from '../../logging/log-utils'
import AddToHomeButton from '@/components/AddToHomeButton'

const Home: NextPage = () => {
  // const [session, loadingUser] = useSession()
  const { data: session, status } = useSession()
  const [error, setError] = useState(false)

  // const logger = getLogger('Home')

  // fileLogger.info('HELLO EXTERNAL LOGS')

  // logger.error('a error message from Home')
  // logger.debug('a debug message from Home')
  // logger.info('a info message from Home')

  const router = useRouter()
  // console.log('Registered?:', router.query?.didRegister)
  // const signinRedirect = process.env.NEXT_PUBLIC_API_URL + 'account'
  ///home/jancy/Documents/Courier/courier-t3/src

  if (status === 'loading') {
    return (
      <div className="dark:bg-dark dark:text-light flex h-screen bg-gray-100 text-gray-900 subpixel-antialiased">
        {/* <!-- Loading screen --> */}
        <div
          // x-ref="loading"
          className="bg-primary-darker fixed inset-0 z-50 flex items-center justify-center text-2xl  font-semibold"
        >
          Loading App.....
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {/* <AddToHomeButton /> */}
      <h1 className="mb-10">Courier Shipping</h1>

      {router.query?.didRegister}

      {router.query?.error ? <p>{router.query.error}</p> : <></>}

      {error ? (
        <p>
          THERE WAS AN ERROR WHILE LOGGING. CHECK TO MAKE SURE THAT YOU ARE
          USING THE CORRECT USERNAME AND PASSWORD.
        </p>
      ) : (
        <></>
      )}

      {!!session ? (
        <div className=" mt-16 flex w-fit flex-col">
          <p> Logged in as {session?.user?.name} </p>
          <button
            className="btn btn-blue"
            onClick={() =>
              signOut({ callbackUrl: process.env.NEXT_PUBLIC_URL_API })
            }
          >
            Sign out
          </button>
          <Link href="/account" passHref>
            <button className="btn btn-blue">account</button>
          </Link>
        </div>
      ) : (
        <div className="w-fit rounded-2xl border border-gray-300 p-2 text-black shadow-md">
          <Formik
            // initialValues={{ email: '', password: '', tenantKey: '' }}
            initialValues={{ email: '', password: '' }}
            validationSchema={Yup.object({
              email: Yup.string()
                .max(30, 'Must be 30 characters or less')
                .email('Invalid email address')
                .required('Please enter your email'),
              password: Yup.string()
                .required('Please enter your password')
                .min(3, 'password is too short'),
              // tenantKey: Yup.string()
              //   .max(20, 'Must be 20 characters or less')
              //   .required('Please enter your organization name'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const res = await signIn('login', {
                redirect: true,
                email: values.email,
                password: values.password,
                // tenantKey: values.tenantKey,
                // callbackUrl: process.env.NEXT_PUBLIC_API_URL + '/SigninLoadingPage',
                callbackUrl: '/account',
              })

              console.log('Signin Response', res)

              if (res?.error) {
                setError(true)
              }

              // this is where the signin happens after nextauth signin function redirects to the same page, index, instead

              setSubmitting(false)
            }}
          >
            {(formik) => {
              return (
                <>
                  <Form className="flex flex-col">
                    <h2 className="text-grey-darkest bold mb-6 block w-full text-center text-xl underline">
                      Login
                    </h2>
                    <FormikControl
                      control="input"
                      type="email"
                      label="Email"
                      name="email"
                    />
                    <FormikControl
                      control="input"
                      type="password"
                      label="Password"
                      name="password"
                    />
                    <div className="flex flex-col items-center">
                      <button
                        type="submit"
                        disabled={!formik.isValid}
                        className="btn btn-blue align-center m-2 w-1/2"
                      >
                        Sign In
                      </button>

                      <Link href="/register" passHref>
                        <a className="btn btn-blue m-2 w-1/2">
                          Don{`'`}t have an account?{' '}
                          <span className="text-red-400">Register here.</span>
                        </a>
                      </Link>
                    </div>
                  </Form>
                </>
              )
            }}
          </Formik>
        </div>
      )}
    </div>
  )
}

export default Home
