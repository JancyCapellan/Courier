import type { NextPage } from 'next'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../contexts/authContext'

const Home: NextPage = () => {
  const { email } = useAuth()
  return (
    <div className=' homeLayout '>
      <div className='homeHeader'>
        <span className=' headerTitle '>WELCOME TO THE ALPHA</span>
      </div>
      <div className='forms'>
        <div className='loginform'>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
export default Home
