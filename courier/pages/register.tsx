import type { NextPage } from 'next'
import RegistrationFormMain from '../components/RegistrationFormMain.jsx'

const Register: NextPage = () => {
  return (
    <div className=' register-page-container'>
      <RegistrationFormMain staff={false} />
    </div>
  )
}
export default Register
