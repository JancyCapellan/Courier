import { signIn, signOut } from 'next-auth/react'
import { useSession } from '../customHooks/useSession'
import Link from 'next/link'
import router from 'next/router'
import { useEffect } from 'react'

const Home = () => {
  const { data: session, status } = useSession()

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
