import { useState } from 'react'
import { signIn, signOut } from 'next-auth/react'
import { useSession } from '../customHooks/useSession'
import Link from 'next/link'
import router from 'next/router'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../components/Formik/FormikControl'
import { useRouter } from 'next/router'

const Home = () => {
  const [session, status] = useSession()
  const [error, setError] = useState(null)

  const router = useRouter()
  console.log('router', router.query?.didRegister)

  // const nextauth_url = process.env.NEXTAUTH_URL
  // const signinRedirect = nextauth_url + 'account'
  const signinRedirect = process.env.NEXT_PUBLIC_URL_API + 'account'
  console.log(process.env.NEXT_PUBLIC_URL_API, signinRedirect)

  //  background, login, user logged in, title of website, link to register
  return (
    <>
      <div className='home-container'>
        <h1> The Courier Dashboard</h1>
        {router.query?.didRegister ? <p>REGISTERED SUCCESSFUL</p> : <></>}
        {error ? (
          <p>
            THERE WAS AN ERROR WHILE LOGGING. CHECK TO MAKE SURE THAT YOU ARE USING THE CORRECT
            USERNAME AND PASSWORD.
          </p>
        ) : (
          <></>
        )}
        <Formik
          // initialValues={{ email: '', password: '', tenantKey: '' }}
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .max(30, 'Must be 30 characters or less')
              .email('Invalid email address')
              .required('Please enter your email'),
            password: Yup.string().required('Please enter your password'),
            // tenantKey: Yup.string()
            //   .max(20, 'Must be 20 characters or less')
            //   .required('Please enter your organization name'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const res = await signIn('login', {
              redirect: false,
              email: values.email,
              password: values.password,
              // tenantKey: values.tenantKey,
              callbackUrl: signinRedirect,
            })
            console.log('res', res)
            if (res?.error) {
              setError(res.error)
            } else {
              setError(null)
            }
            if (res.url) router.push(res.url)
            console.log('error', error)
            setSubmitting(false)
          }}
        >
          {(formik) => {
            return (
              <>
                <Form className='signin-form'>
                  <h2>Login</h2>
                  <FormikControl
                    control='input'
                    type='email'
                    label='Email'
                    name='email'
                    className='test'
                  />
                  <FormikControl control='input' type='password' label='Password' name='password' />
                  <button type='submit' disabled={!formik.isValid}>
                    Submit
                  </button>
                  <Link href='/register' passHref>
                    <button>Dont have an account? Register here.</button>
                  </Link>
                </Form>
              </>
            )
          }}
        </Formik>
      </div>
    </>
  )
}
export default Home
