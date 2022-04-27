import React, { useState, useEffect } from 'react'
import { sidebarTypes } from './SidebarData'
import Link from 'next/link'
// import logo from '../assets/logo-dark.png'
import { useSession } from '../customHooks/useSession'
// import * from '../styles/Sidebar.module.css'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sidebarToggler = () => {
    setIsCollapsed(!isCollapsed)
  }

  // const { email, role, firstName } = useAuth()

  // useEffect(() => {
  //   console.log('sidebar render')
  // })

  // const [session, loading] = useSession()
  // console.log('sidebar user session data', session, 'loading', loading)

  // logic to set role and name fr
  // let role, name
  // if (!loading) {
  //   ;({ role, name } = session.user)
  // } else {
  //   role = 'CUST'
  // }

  let role = 'ADMIN'
  //will switch the sidebar data to show links to routes per user role
  let SidebarData = []
  const SidebarDataSwitcher = () => {
    switch (role) {
      case 'CUST':
        SidebarData = sidebarTypes.CUST
        break
      case 'ADMIN':
        SidebarData = sidebarTypes.ADMIN
        break
      case 'DRIVE':
        SidebarData = sidebarTypes.DRIVER
        break
      case 'SECT':
        SidebarData = sidebarTypes.SECT
        break
      default:
        SidebarData = sidebarTypes.ADMIN
        break
    }
  }

  SidebarDataSwitcher()

  return (
    <>
      <nav className={isCollapsed ? 'sidebar collapsed' : 'sidebar'}>
        <span>{/* Welcome {name}! <b>Role: {role}</b> */}</span>
        <ul className='sidebar-list'>
          <li key='sidebarToggle' className=''>
            <div className='sidebar-toggle-btn' onClick={sidebarToggler}>
              <svg
                viewBox='0 0 24 24'
                preserveAspectRatio='xMidYMid meet'
                focusable='false'
                className='menu-icon'
              >
                <g>
                  <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'></path>
                </g>
              </svg>
            </div>
          </li>

          {SidebarData.map((item, index) => {
            return (
              <li
                key={index}
                className={item.cName} // nav-listitem
              >
                <Link href={item.path} passHref={true}>
                  <a className='sidebar-link'>
                    <div className='sidebar-link-icon'>{item.icon}</div>
                    <div className='sidebar-link-title'>{item.title}</div>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {/* <main className='main-content'>{children}</main> */}
    </>
  )
}

export default Sidebar
