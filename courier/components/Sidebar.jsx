import React, { useState } from 'react'
import { sidebarTypes } from './SidebarData'
import Link from 'next/link'
// import logo from '../assets/logo-dark.png'
import { useAuth } from '../contexts/authContext'

const Sidebar = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sidebarToggler = () => {
    setIsCollapsed(!isCollapsed)
  }

  const { email, role } = useAuth()

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
      case 'STAFF':
        SidebarData = sidebarTypes.STAFF
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
          <div className='sidebar-logo-container'>
            {/* <img className='sidebar-logo' src={logo} alt='logo' /> */}
          </div>
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
              <li key={index} className={item.cName}>
                <Link href={item.path}>
                  <>
                    <span className='sidebar-link-icon'>{item.icon}</span>
                    <span className='sidebar-link-title'>{item.title}</span>
                  </>
                </Link>
              </li>
            )
          })}
        </ul>
        <button>Log out</button>
        <button className='' onClick={sidebarToggler}>
          \====
        </button>
      </nav>

      <div className='main-content'>{children}</div>
    </div>
  )
}

export default Sidebar
