import { Formik, Form } from 'formik'
import FormikControl from './Formik/FormikControl'
import * as Yup from 'yup'
import Link from 'next/link'
import { useAuth } from '../contexts/authContext'

export default function LoginForm() {
  const { login } = useAuth()

  const initialValues = {
    loginEmail: '',
    password: '',
  }

  const validationSchema = Yup.object().shape({
    loginEmail: Yup.string()
      .email('*Must be a valid email address')
      .max(100, '*Email must be less than 100 characters')
      .required('*Email is required'),

    password: Yup.string().required('Enter Password'),
  })

  const onSubmit = (values: any) => {
    login(values)
  }
  return (
    <div className=''>
      <h1>Login </h1>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(formik) => {
          return (
            <Form>
              <FormikControl control='input' type='email' label='Email' name='loginEmail' />
              <FormikControl control='input' type='password' label='Password' name='password' />
              <button type='submit' disabled={!formik.isValid}>
                Submit
              </button>
            </Form>
          )
        }}
      </Formik>

      <div>
        Need an Account? <Link href='/register'> Register </Link>
      </div>
    </div>
  )
}
