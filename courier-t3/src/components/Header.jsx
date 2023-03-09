import { trpc } from '@/utils/trpc'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { usePersistedLocallyStore } from './globalStore'
// import { useSession } from '../customHooks/useSession'

// import { useSession } from '@/components/hooks/useSession'

function Header({ closeSidebar, setCloseSidebar }) {
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
      <header className="header flex h-12 flex-col justify-center bg-black py-1 px-2">
        <section className="flex flex-row justify-between text-white">
          <div>Courier{`&apos`}s Dashboard</div>
          <div>Loading User Session...</div>
        </section>
      </header>
    )

  return (
    <header className="flex h-12 flex-col justify-center bg-black py-1 px-2">
      <section className="flex flex-row justify-between gap-2 text-white">
        <div className=" flex cursor-pointer items-center bg-black ">
          <svg
            onClick={() => {
              setCloseSidebar(!closeSidebar)
            }}
            fill="#2563EB"
            viewBox="0 0 100 80"
            width="40"
            height="40"
          >
            <rect width="100" height="10"></rect>
            <rect y="30" width="100" height="10"></rect>
            <rect y="60" width="100" height="10"></rect>
          </svg>
        </div>
        {/* <div>Courier{`&apos`}s Dashboard</div> */}
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
