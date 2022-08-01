import { signOut } from 'next-auth/react'
import { useSession } from '../customHooks/useSession'

function Header() {
  const [session, status] = useSession()
  // console.log('header session data', session, 'status', status)
  return (
    <header className='header'>
      <section className='header-user-info'>
        <span>
          Welcome {session?.user.name}! <b>Role: {session?.user.role}</b>
        </span>
        <button onClick={() => signOut({ callbackUrl: process.env.NEXTAUTH_URL })}>Sign out</button>
      </section>
    </header>
  )
}

export default Header
