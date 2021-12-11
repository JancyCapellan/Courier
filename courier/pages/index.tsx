import type { NextPage } from 'next'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../contexts/authContext'
import { useSession, signIn, signOut } from 'next-auth/react'

function NextAuthLogin() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

const Home: NextPage = () => {
  // const { email } = useAuth()
  return (
    <div className=' homeLayout '>
      <div className='homeHeader'>
        <span className=' headerTitle '>WELCOME TO THE ALPHA</span>
      </div>
      <div className='forms'>
        <div className='loginform'>
          {/* <LoginForm /> */}
          <NextAuthLogin />
        </div>
      </div>
    </div>
  )
}
export default Home
