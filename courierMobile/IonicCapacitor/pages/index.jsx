import { signIn, signOut } from 'next-auth/react'
import { useSession } from '../customHooks/useSession'
import Link from 'next/link'
import router from 'next/router'
import { useEffect } from 'react'

const Home = () => {
  // use sessions options to make sure react query caches
  const [session, status] = useSession()
  console.log('home session', session, 'loading', status)

  // effect to move to account page if there is a session already logged in
  // useEffect(() => {
  //   if (session) {
  //     router.push('/account')
  //   }
  // }, [session])
  return (
    <>
      <div className='home-container'>
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
