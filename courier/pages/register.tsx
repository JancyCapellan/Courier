import type { NextPage } from 'next'
import RegistrationForm from '../components/RegistrationForm.jsx'

const Register: NextPage = () => {
  return (
    <div className=' homeLayout '>
      <div className='homeHeader'>
        <span className=' headerTitle '>WELCOME TO THE ALPHA</span>
      </div>
      <div className='forms'>
        <div className='loginform'>
          <RegistrationForm staff={false} />
        </div>
      </div>
    </div>
  )
}
export default Register
