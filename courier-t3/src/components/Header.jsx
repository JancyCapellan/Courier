import { trpc } from '@/utils/trpc'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { usePersistedLocallyStore } from './globalStore'
// import { useSession } from '../customHooks/useSession'

// import { useSession } from '@/components/hooks/useSession'

function Header() {
  // const [session, status] = useSession()
  // const [session, isloading] = useSession()
  const { data: session, status: sessionStatus } = useSession()
  // const clearLocalStorage = usePersistedLocallyStore(
  //   (state) => state.clearLocalStorage
  // )
  const router = useRouter()
  // console.log('header session data', session, 'status', status)

  if (sessionStatus === 'loading')
    return (
      <header className="header flex flex-col justify-center bg-black h-12 py-1 px-2">
        <section className="flex flex-row justify-between text-white">
          <div>Courier{`&apos`}s Dashboard</div>
          <div>Loading User Session...</div>
        </section>
      </header>
    )

  return (
    <header className="header flex flex-col justify-center bg-black h-12 py-1 px-2">
      <section className="flex flex-row justify-between text-white">
        <div>Courier{`&apos`}s Dashboard</div>
        <div>
          Welcome {session?.user.name}! |{' '}
          <b className="text-red-600">Role: {session?.user.role}</b>
        </div>
        <button
          onClick={() => {
            signOut({ callbackUrl: '/' })
          }}
        >
          Sign out
        </button>
      </section>
    </header>
  )
}

export default Header
