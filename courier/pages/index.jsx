import { signIn, signOut } from 'next-auth/react'
import { useSession } from '../customHooks/useSession'
import Link from 'next/link'
import router from 'next/router'
import { useEffect } from 'react'

const Home = () => {
  // use sessions options to make sure react query caches
  const [session, status] = useSession()
  console.log('home session', session, 'loading', status)

  return (
    <>
      <div className='home-container'>
        <header className='home-header'>
          {session ? (
            <>
              <span>Welcome {session?.user?.name}! </span>
              <button onClick={() => signOut({ callbackUrl: process.env.API_URL })}>
                Sign out
              </button>
            </>
          ) : (
            <span>Not signed in</span>
          )}
        </header>
        <h1 className='home-h1'>Shipping company manager</h1>
        {!session ? (
          <div className='home-no-session'>
            <Link href='/signin'>
              <a className='home-btn'>Signin</a>
            </Link>
            <Link href='/register' passHref>
              <button>register</button>
            </Link>
          </div>
        ) : (
          <>
            <Link href='/account' passHref>
              <button>Your Account</button>
            </Link>
          </>
        )}
      </div>
    </>
  )
}
export default Home
