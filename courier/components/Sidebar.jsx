import React, { useState, useEffect } from 'react'
import { sidebarTypes, sidebarTypesSelector } from './SidebarData'
import Link from 'next/link'
// import logo from '../assets/logo-dark.png'
import { useSession } from '../customHooks/useSession'
// import * from '../styles/Sidebar.module.css'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState()
  const sidebarToggler = () => {
    setIsCollapsed(!isCollapsed)
    localStorage.setItem('sidebarToggle', isCollapsed)
  }

  useEffect(() => {
    const toggle = localStorage.getItem('sidebarToggle')
    setIsCollapsed(toggle)
  }, [])
  // const { email, role, firstName } = useAuth()

  const [session, loading] = useSession()

  let sidebarData
  if (loading === false) {
    sidebarData = sidebarTypesSelector(session.user.role)
  }
  // console.log('sidebardata', sidebarData)
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

          {loading === false ? (
            sidebarData.map((item, index) => {
              return (
                <li
                  key={index}
                  className={item.cName} // nav-listitem
                >
                  {/* {item.path === '/account' ? (item.path = `/customer/${session.user.id}`) : ''} */}
                  <Link href={item.path} passHref={true}>
                    <a className='sidebar-link'>
                      <div className='sidebar-link-icon'>{item.icon}</div>
                      <div className='sidebar-link-title'>{item.title}</div>
                    </a>
                  </Link>
                </li>
              )
            })
          ) : (
            <>
              <p>error loading or loading still</p>
            </>
          )}
        </ul>
      </nav>
      {/* <main className='main-content'>{children}</main> */}
    </>
  )
}

export default Sidebar
