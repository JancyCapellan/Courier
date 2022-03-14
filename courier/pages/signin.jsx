import { useState } from 'react'
import { signIn, getCsrfToken } from 'next-auth/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import FormikControl from '../components/Formik/FormikControl'

export default function SignIn({ csrfToken }) {
  const router = useRouter()
  const [error, setError] = useState(null)

  return (
    <div className='container'>
      <h1>LOGIN TO APP</h1>
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
            redirect: true,
            email: values.email,
            password: values.password,
            // tenantKey: values.tenantKey,
            callbackUrl: 'http://localhost:3000/account',
          })
          if (res?.error) {
            setError(res.error)
          } else {
            setError(null)
          }
          if (res.url) router.push(res.url)
          setSubmitting(false)
        }}
      >
        {(formik) => {
          return (
            <Form className='signin-form'>
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
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
