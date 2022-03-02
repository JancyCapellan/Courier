import type { NextPage } from 'next'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import router from 'next/router'
import { useEffect } from 'react'

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
        <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn('login', { callbackUrl: 'http://localhost:3000/account' })}>
        Sign in
      </button>
    </>
  )
}

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  // useEffect(() => {
  //   if (!!session?.user) {
  //     router.push('/account')
  //   }
  // })

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
