import type { NextPage } from 'next'
import RegistrationFormMain from '../components/RegistrationFormMain.jsx'

const Register: NextPage = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h1>Registration</h1>
      <RegistrationFormMain />
    </div>
  )
}
export default Register
