import React, { useState } from 'react'
import { sidebarTypes } from './SidebarData'
import Link from 'next/link'
// import logo from '../assets/logo-dark.png'
import { useAuth } from '../contexts/authContext'
import Router from 'next/router'
import { useSession, signOut } from 'next-auth/react'

const Sidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sidebarToggler = () => {
    setIsCollapsed(!isCollapsed)
  }

  // const { email, role, firstName } = useAuth()

  const { data: session, status } = useSession()
  console.log('sidebar session', session)

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
    <div className='page-layout'>
      <nav className={isCollapsed ? 'sidebar-collapsed' : 'sidebar'}>
        <section className='sidebar-header'>
          <b>
            User: {name} Role: {role}
          </b>
          {/* <div className='sidebar-logo-container'>
            <img className='sidebar-logo' src={logo} alt='logo' />
          </div> */}
          {/* <button
            className={isCollapsed ? 'sidebar-toggle' : 'sidebar-toggle-off'}
            onClick={sidebarToggler}
          >
            &#60;
          </button>
          <button
            className={!isCollapsed ? 'sidebar-toggle' : 'sidebar-toggle-off'}
            onClick={sidebarToggler}
          >
            &#62;
          </button> */}
        </section>
        {/* <div className=''>
          cart <span>CART TOTAL</span>
        </div> */}
        <ul className='sidebar-links'>
          {SidebarData.map((item, index) => {
            return (
              <li
                key={index}
                className={item.cName}
                onClick={() => {
                  Router.push(item.path) // Replaced with `router.push`
                }}
              >
                <>
                  <span className='sidebar-link-icon'>{item.icon}</span>
                  <span className='sidebar-link-title'>{item.title}</span>
                </>
              </li>
            )
          })}
        </ul>
        <button onClick={() => signOut()}>Sign out</button>
        {/* <button className='' onClick={sidebarToggler}>
          \====
        </button> */}
      </nav>

      <div className='main-content'>{children}</div>
    </div>
  )
}

export default Sidebar
