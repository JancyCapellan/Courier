import React from 'react'
import { UserIcon, UsersIcon } from '@heroicons/react/outline'

// cname is className
// { staff:[], cust: [], admin:[]}
export const routes = {
  account: {
    title: 'Account',
    path: '/account',
    icon: <UserIcon className='h-5 w-5 text-blue-500' />,
    cName: 'nav-listitem',
  },
  administration: {
    title: 'Admin',
    path: '/administration',
    icon: '',
    cName: 'nav-listitem',
  },
  invoices: {
    title: 'Invoices',
    path: '/Invoices',
    icon: '',
    cName: 'nav-listitem',
  },
  pickups: {
    title: 'Pickup Manager',
    path: '/pickup',
    icon: '',
    cName: 'nav-listitem',
  },
  driverPage: {
    title: 'Driver Page',
    path: '/driverPage',
    icon: '',
    cName: 'nav-listitem',
  },
  createOrder: {
    title: 'Order',
    path: '/order',
    icon: '',
    cName: 'nav-listitem',
  },
  cart: {
    title: 'Cart',
    path: '/cart',
    icon: '',
    cName: 'nav-listitem',
  },
  customers: {
    title: 'Customers',
    path: '/customers',
    icon: '',
    cName: 'nav-listitem',
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
    icon: '',
    cName: 'nav-listitem',
  },
  adminstration: {
    title: 'Adminastration',
    path: '/sidebar',
    icon: '',
    cName: 'nav-listitem',
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

export function sidebarTypesSelector(role) {
  return sidebarTypes[role]
}
