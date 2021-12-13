import type { NextPage } from 'next'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../contexts/authContext'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { redirect } from 'next/dist/server/api-utils'

function NextAuthLogin() {
  const { data, status, data: session } = useSession()
  console.log('SESSION', data)
  let user = data?.user
  console.log('USER', user)
  if (session) {
    return (
      <>
        Signed in as {session?.user?.email} <br />
        {/* <pre>{session.user?.email}</pre> */}
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
  const { data: session } = useSession()

  return (
    <div className=' homeLayout '>
      <div className='homeHeader'>
        <span className=' headerTitle '>WELCOME TO THE ALPHA</span>
      </div>
      <div className='forms'>
        <div>
          Need an Account? <Link href='/register'> Register </Link>
        </div>
        {session ? <Link href='/account'> Open Account</Link> : <></>}
        <div className='loginform'>
          {/* <LoginForm /> */}
          <NextAuthLogin />
        </div>
      </div>
    </div>
  )
}
export default Home
