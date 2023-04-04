import { useSession } from 'next-auth/react'
import Header from './Header'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// * TODO: react memo so only main rerenders and not header and sidebar, but not causing any visuale issue right now

export default function Layout({ children }) {
  const [toggleSidebar, setToggleSidebar] = useState(false)

  const session = useRequireAuth()
  if (!session) return <> session expired, redirecting to login page </>

  //old, for testing
  if (false) {
    return (
      <div className="flex h-screen">
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <div className="flex h-full">
            <Sidebar test="5" />
            <main className="mb-6 flex w-full flex-col overflow-x-auto overflow-y-auto bg-white p-6">
              {children}
            </main>
          </div>
        </div>

        {/* <Footer /> */}
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col ">
      <Header
        closeSidebar={toggleSidebar}
        setCloseSidebar={(t) => setToggleSidebar(t)}
      />
      <div className="flex h-screen overflow-y-hidden">
        <Sidebar
          closeSidebar={toggleSidebar}
          setCloseSidebar={(t) => setToggleSidebar(t)}
        />
        <main className="flex w-full flex-col overflow-x-auto  bg-white p-6 ">
          {children}
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  )
}

function useRequireAuth() {
  const { data: session } = useSession()
  const router = useRouter()

  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (!session && typeof session != 'undefined') {
      router.push({
        pathname: '/',
        query: { sessionExpired: true },
      })
    }
  }, [session, router])

  return session
}
