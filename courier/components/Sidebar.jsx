import React, { useState } from 'react'
import { sidebarTypes } from './SidebarData'
import Link from 'next/link'
// import logo from '../assets/logo-dark.png'
import { useSession, signOut } from 'next-auth/react'
// import * from '../styles/Sidebar.module.css'

const Sidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sidebarToggler = () => {
    setIsCollapsed(!isCollapsed)
  }

  // const { email, role, firstName } = useAuth()

  const { data: session, status } = useSession()
  // console.log('sidebar session', session)

  let role, name
  if (status === 'authenticated') {
    ;({ role, name } = session.user)
  } else {
    role = 'CUST'
  }

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
      <header className='page-header'>
        <button className='menu-icon-btn' onClick={sidebarToggler}>
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
        </button>
        <section className='header-user-info'>
          <span>
            Welcome {name}! <b>Role: {role}</b>
          </span>
          <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>
            Sign out
          </button>
        </section>
      </header>
      <section className='page-layout'>
        <nav className={isCollapsed ? 'sidebar-collapsed' : 'sidebar'}>
          <ul className='sidebar-list'>
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

        <main className='main-content'>{children}</main>
      </section>
    </>
  )
}

export default Sidebar
