import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { sidebarTypes } from './SidebarData'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconContext } from 'react-icons'

const Sidebar = () => {
  const { data: session, status } = useSession()

  const [showSidebar, setShowSidebar] = useState()

  const router = useRouter()

  // useEffect(() => {
  //   const toggle = localStorage.getItem('sidebarToggle')
  //   setShowSidebar(toggle)
  // }, [])

  // useEffect(() => {
  //   // storing input name
  //   localStorage.setItem('toggle', JSON.stringify(showSidebar))
  // }, [showSidebar])

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

  let sidebarData
  if (status === 'authenticated')
    sidebarData = sidebarTypes[session?.user?.role]

  return (
    <>
      <div
        className={`w-1/5 bg-black  text-white h-full flex flex-col items-center ease-in-out  ${
          showSidebar ? 'w-1/12' : 'w-1/5'
        }`}
      >
        <button className=' flex items-center cursor-pointer'>
          <svg
            onClick={() => {
              setShowSidebar(!showSidebar)
            }}
            fill='#2563EB'
            viewBox='0 0 100 80'
            width='40'
            height='40'
          >
            <rect width='100' height='10'></rect>
            <rect y='30' width='100' height='10'></rect>
            <rect y='60' width='100' height='10'></rect>
          </svg>
        </button>

        <nav>
          <ul>
            <IconContext.Provider value={{ color: '#2563EB', size: '2em' }}>
              {status === 'authenticated' ? (
                sidebarData.map((item, index) => {
                  return (
                    <li key={index} className=''>
                      {item.title === 'Order' ? (
                        <Link href={item.path} passHref={true}>
                          <a
                            onClick={() => setCurrentCustomer(session.user)}
                            className='sidebar-link'
                          >
                            <div className={` ${showSidebar ? 'p-1 ' : 'p-5'}`}>
                              {item.icon}
                            </div>
                            <div className={` ${showSidebar ? 'p-1 ' : 'p-5'}`}>
                              {item.title}
                            </div>
                          </a>
                        </Link>
                      ) : (
                        <Link href={item.path} passHref={true}>
                          <a className='sidebar-link'>
                            <div className={` ${showSidebar ? '' : 'p-1'}`}>
                              {item.icon}
                            </div>
                            <div
                              className={` ${showSidebar ? 'hidden' : 'p-1'}`}
                            >
                              {item.title}
                            </div>
                          </a>
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
