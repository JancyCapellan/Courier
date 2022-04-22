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
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      router.push('/account')
    }
  }, [session])
  return (
    <>
      <header className='home-header'>
        {session ? (
          <>
            <span>Welcome {session?.user?.name}! </span>
            <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>
              Sign out
            </button>
          </>
        ) : (
          <span>Not signed in</span>
        )}
      </header>
      <h1 className='home-h1'>Shipping company manager</h1>
      <div className='home-container'>
        {/* {!session ? <Link href='/account'> Open Account</Link> : <></>} */}
        {!session ? (
          <Link href='/signin'>
            <a className='home-btn'>Signin</a>
          </Link>
        ) : (
          <></>
        )}
        {!session ? (
          <Link href='/register' passHref>
            <button>register</button>
          </Link>
        ) : (
          <Link href='/account' passHref>
            <button>Your Account</button>
          </Link>
        )}
      </div>
    </>
  )
}
export default Home
