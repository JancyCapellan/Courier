import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { sidebarTypes } from './SidebarData'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { IconContext } from 'react-icons'
import { TbFileInvoice } from 'react-icons/tb'
import { FiSettings } from 'react-icons/fi'
import useWindowDimensions from './hooks/useWindowDimensions'

const Sidebar = ({ closeSidebar, setCloseSidebar }) => {
  const { data: session, status } = useSession()

  const { width, height } = useWindowDimensions()

  // const [closeSidebar, setCloseSidebar] = useState(false)

  const [sidebarData, setSidebarData] = useState([])
  const [floatingSidebar, setFloatingSidebar] = useState(true)

  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user?.role === 'CUSTOMER') {
        setSidebarData([
          {
            title: 'User Account',
            path: '/account',
            icon: <FiSettings />,
          },
          {
            title: 'create Order',
            path: `/createOrder?customerId=${session?.user?.id}`,
            icon: <TbFileInvoice />,
          },
        ])
      } else {
        setSidebarData(sidebarTypes[session?.user?.role])
      }
    }
  }, [session])

  useEffect(() => {
    if (width < 768) setCloseSidebar(true)
  }, [width])

  //if view port normal use this, if this is hidden on sm viewpoer, the closeSidebar toggle show show a floating sidebar

  //Floating sidebar when on sm screens
  if (width < 768) {
    return (
      <>
        <div
          className={`dark:border-primary-darker dark:bg-darker absolute top-0  left-0  flex h-full flex-col items-center bg-black text-white ease-in-out ${
            closeSidebar ? 'hidden' : ' '
          }`}
        >
          <button className=" flex cursor-pointer items-center">
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
          </button>{' '}
          <nav>
            <ul>
              <IconContext.Provider value={{ color: '#2563EB', size: '2em' }}>
                {status === 'authenticated' ? (
                  sidebarData.map((item, index) => {
                    return (
                      <Link key={index} href={item.path} passHref={true}>
                        <a
                          onClick={() => {
                            if (item.title === 'Order') {
                              setCurrentCustomer(session.user)
                            }
                            setCloseSidebar(!closeSidebar)
                          }}
                          className="sidebar-link w-min gap-3"
                        >
                          <div className={` ${closeSidebar ? '' : ''}`}>
                            {item.icon}
                          </div>

                          {!!!closeSidebar && (
                            <div
                              className={` ${closeSidebar ? 'invisible' : ''}`}
                            >
                              {item.title}
                            </div>
                          )}
                        </a>
                      </Link>
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

  return (
    <div
      className={`dark:border-primary-darker dark:bg-darker hidden bg-black  text-white ease-in-out  md:flex md:justify-center ${
        closeSidebar ? 'w-1/20' : ' w-1/10 '
      }`}
    >
      {/* <div>
        width: {width} ~ height: {height}
      </div> */}
      <nav>
        <ul>
          <IconContext.Provider value={{ color: '#2563EB', size: '2em' }}>
            {status === 'authenticated' ? (
              sidebarData.map((item, index) => {
                return (
                  <li key={index} className="">
                    {/* order link needed a different onclick handler */}
                    {item.title === 'Order' ? (
                      <Link href={item.path} passHref={true}>
                        <div
                          onClick={() =>
                            item.title === 'Order' && //maybe a way to remove basically the same link component
                            setCurrentCustomer(session.user)
                          }
                          className="sidebar-link"
                        >
                          <div className={` ${closeSidebar ? ' ' : ''}`}>
                            {item.icon}
                          </div>
                          <div className={` ${closeSidebar ? 'hidden' : ''}`}>
                            {item.title}
                          </div>
                        </div>
                      </Link>
                    ) : (
                      // All links
                      <Link href={item.path} passHref={true}>
                        <div className="sidebar-link w-min gap-3">
                          <div className={` ${closeSidebar ? '' : ''}`}>
                            {item.icon}
                          </div>

                          {!!!closeSidebar && (
                            <div
                              className={` ${closeSidebar ? 'invisible' : ''}`}
                            >
                              {item.title}
                            </div>
                          )}
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
  )
}

export default Sidebar
