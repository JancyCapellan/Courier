import { signOut, useSession } from 'next-auth/react'
// import { useSession } from '../customHooks/useSession'

function Header() {
  // const [session, status] = useSession()
  const { data: session, status } = useSession()

  // console.log('header session data', session, 'status', status)
  return (
    <header className='header flex flex-col justify-center bg-black h-12 py-1 px-2'>
      <section className='flex flex-row justify-between text-white'>
        <div>Courier's Dashboard</div>
        <div>
          Welcome {session?.user.name}! |{' '}
          <b className='text-red-600'>Role: {session?.user.role}</b>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
      </section>
    </header>
  )
}

export default Header
