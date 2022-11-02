import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { sidebarTypes } from './SidebarData'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconContext } from 'react-icons'

const Sidebar = () => {
  const { data: session, status } = useSession()

  const [closeSidebar, setCloseSidebar] = useState()

  const router = useRouter()

  // useEffect(() => {
  //   const toggle = localStorage.getItem('sidebarToggle')
  //   setCloseSidebar(toggle)
  // }, [])

  // useEffect(() => {
  //   // storing input name
  //   localStorage.setItem('toggle', JSON.stringify(closeSidebar))
  // }, [closeSidebar])

  // ! route guard should function better than this
  // useEffect(() => {
  //   if (!session || status === 'unauthenticated') {
  //     router.push({
  //       pathname: '/',
  //       query: {
  //         failedSidebarLoad:
  //           'there was an error loading session for appropriate sidebar data',
  //       },
  //     })
  //   }
  // }, [session, status])

  // useEffect(() => {
  //   let sidebarData
  //   if (status === 'authenticated') {
  //     sidebarData = sidebarTypes[session?.user?.role]
  //     if (typeof sidebarData === 'undefined')
  //       router.push({
  //         pathname: '/',
  //         query: { error: 'sidebar data error, session object data missing' },
  //       })
  //   } else {
  //     router.push({
  //       pathname: '/',
  //       query: { error: 'sidebar data error, session object data missing' },
  //     })
  //   }
  // }, [status])

  let sidebarData
  if (status === 'authenticated')
    sidebarData = sidebarTypes[session?.user?.role]

  return (
    <>
      <div
        className={` bg-black  text-white h-full flex flex-col items-center ease-in-out ${
          closeSidebar ? 'w-1/12' : ' w-1/5 '
        }`}
      >
        <button className=" flex items-center cursor-pointer">
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
        </button>

        <nav>
          <ul>
            <IconContext.Provider value={{ color: '#2563EB', size: '2em' }}>
              {status === 'authenticated' ? (
                sidebarData.map((item, index) => {
                  return (
                    <li key={index} className="">
                      {item.title === 'Order' ? (
                        <Link href={item.path} passHref={true}>
                          <div
                            onClick={() => setCurrentCustomer(session.user)}
                            className="sidebar-link"
                          >
                            <div
                              className={` ${closeSidebar ? 'p-1 ' : 'p-5'}`}
                            >
                              {item.icon}
                            </div>
                            <div
                              className={` ${closeSidebar ? 'p-1 ' : 'p-5'}`}
                            >
                              {item.title}
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <Link href={item.path} passHref={true}>
                          <div className="sidebar-link">
                            <div className={` ${closeSidebar ? '' : 'p-1'}`}>
                              {item.icon}
                            </div>
                            <div
                              className={` ${closeSidebar ? 'hidden' : 'p-1'}`}
                            >
                              {item.title}
                            </div>
                          </div>
                        </Link>
                      )}
                    </li>
                  )
                })
              ) : (
                <>
                  <p>error loading or loading still</p>
                </>
              )}
            </IconContext.Provider>
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
