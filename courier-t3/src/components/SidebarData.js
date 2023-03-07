import React from 'react'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { FiSettings } from 'react-icons/fi'
import { GrGroup } from 'react-icons/gr'
import { FaFileInvoiceDollar, FaWarehouse } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/md'
import { useSession } from 'next-auth/react'
import { TbFileInvoice } from 'react-icons/tb'
// cname is className
// { staff:[], cust: [], admin:[]}

// async function CustomerLinks() {
//   const { data: session, status: sessionStatus } = useSession()

//   if (sessionStatus === 'authenticated') {
//     let links = {
//       createOrder: {
//         title: 'create Order',
//         path: '/createOrder',
//         icon: <TbFileInvoice />,
//       },
//     }
//     return links
//   }
// }

export const routes = {
  administration: {
    title: 'Business Administration',
    path: '/administration',
    icon: <MdAdminPanelSettings />,
  },
  account: {
    title: 'User Account',
    path: '/account',
    icon: <FiSettings />,
  },
  invoices: {
    title: 'Invoices',
    path: '/Invoices',
    icon: <FaFileInvoiceDollar />,
  },
  pickups: {
    title: 'Pickup Manager',
    path: '/pickup',
    icon: '',
  },
  driverPage: {
    title: 'Driver Page',
    path: '/driverPage',
    icon: '',
  },
  createOrder: {
    title: 'create Order',
    path: '/createOrder',
    icon: <TbFileInvoice />,
  },
  cart: {
    title: 'Cart',
    path: '/cart',
    icon: '',
  },
  customers: {
    title: 'Customers',
    path: '/customers',
    icon: <HiOutlineUserGroup />,
  },
  crm: {
    title: 'Client Relations Manager',
    path: '/crm',
    icon: '',
    cName: 'nav-listitem',
  },
  claims: {
    title: 'Claim Manager',
    path: '/claims',
    icon: '',
    cName: 'nav-listitem',
  },
  warehouse: {
    title: 'warehouse',
    path: '/warehouse',
    icon: <FaWarehouse />,
  },
  support: {
    title: 'Support',
    path: '/support',
    icon: '',
    cName: 'nav-listitem',
  },
  employees: {
    title: 'employees',
    path: '/administration/employees',
    icon: <HiOutlineUserGroup />,
    cName: 'nav-listitem',
  },
  reports: {
    cName: 'nav-listitem',
    title: 'Reports',
    path: '/reports',
    icon: '',
  },
}
export const sidebarTypes = {
  //TODO: ICONS AND DOUBLE CHECK ROUTES
  SECT: [routes.account, routes.customers, routes.invoices],
  DRIVER: [routes.account, routes.pickups],
  CUSTOMER: [routes.account, routes.createOrder],
  ADMIN: [
    routes.administration,
    routes.employees,
    routes.account,
    routes.customers,
    routes.invoices,
    routes.warehouse,
    // routes.crm,
    // routes.reports,
  ],
  All: [routes],
}
