import React from 'react'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { FiSettings } from 'react-icons/fi'
import { GrGroup } from 'react-icons/gr'
import { FaFileInvoiceDollar, FaWarehouse } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/Md'

// cname is className
// { staff:[], cust: [], admin:[]}
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
    title: 'Order',
    path: '/order',
    icon: '',
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
  reports: {
    cName: 'nav-listitem',
    title: 'Reports',
    path: '/reports',
    icon: '',
  },
}
export const sidebarTypes = {
  SECT: [routes.account, routes.customers, routes.invoices, routes.warehouse],
  DRIVER: [routes.account, routes.pickups, routes.warehouse, routes.driverPage],
  CUSTOMER: [routes.account, routes.createOrder, routes.cart, routes.support],
  ADMIN: [
    routes.administration,
    routes.account,
    routes.customers,
    routes.invoices,
    routes.warehouse,
    // routes.crm,
    // routes.reports,
  ],
  All: [routes],
}
