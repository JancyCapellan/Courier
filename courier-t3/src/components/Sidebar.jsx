import React, { useState, useEffect } from 'react'
import { sidebarTypes } from './SidebarData'
import Link from 'next/link'
// import logo from '../assets/logo-dark.png'
// import { useSession } from '../customHooks/useSession'
// import * from '../styles/Sidebar.module.css'
import { useGlobalStore } from '@/components/globalStore.js'
import { useSession } from 'next-auth/react'
import { IconContext } from 'react-icons'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState()
  // const [session, loading] = useSession()
  const { data: session, status } = useSession()

  const sidebarToggler = () => {
    setIsCollapsed(!isCollapsed)
    localStorage.setItem('sidebarToggle', isCollapsed)
  }

  useEffect(() => {
    const toggle = localStorage.getItem('sidebarToggle')
    setIsCollapsed(toggle)
  }, [])

  const setCurrentCustomer = useGlobalStore((state) => state.setCurrentCustomer)

  //if not session return to login? this should be avoided if possible when logging into the app
  if (!session || status === 'unauthenticated') return <></>

  let sidebarData
  if (status === 'authenticated') {
    sidebarData = sidebarTypes[session.user.role]
  }

  // console.log('sidebardata', sidebarData)

  return (
    <>
      <nav className={isCollapsed ? 'sidebar collapsed' : 'sidebar'}>
        <span>{/* Welcome {name}! <b>Role: {role}</b> */}</span>
        <ul className="sidebar-list">
          <li key="sidebarToggle" className="">
            <div className="sidebar-toggle-btn" onClick={sidebarToggler}>
              <svg
                viewBox="0 0 24 24"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
                className="menu-icon"
              >
                <g>
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                </g>
              </svg>
            </div>
          </li>
          <IconContext.Provider value={{ color: 'white', size: '4em' }}>
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
                          <div className="sidebar-link-icon">{item.icon}</div>
                          <div className="sidebar-link-title">{item.title}</div>
                        </div>
                      </Link>
                    ) : (
                      <Link href={item.path} passHref={true}>
                        <div className="sidebar-link">
                          <div className="sidebar-link-icon">{item.icon}</div>
                          <div className="sidebar-link-title">{item.title}</div>
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
      {/* <main className='main-content'>{children}</main> */}
    </>
  )
}

export default Sidebar
