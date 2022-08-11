import React from 'react'
import * as Bi from 'react-icons/bi'

// cname is className
// { staff:[], cust: [], admin:[]}
export const routes = {
  account: {
    title: 'Account',
    path: '/account',
    icon: <Bi.BiUser />,
    cName: 'nav-listitem',
  },
  administration: {
    title: 'Admin',
    path: '/administration',
    icon: <Bi.BiAnchor />,
    cName: 'nav-listitem',
  },
  invoices: {
    title: 'Invoices',
    path: '/Invoices',
    icon: <Bi.BiAdjust />,
    cName: 'nav-listitem',
  },
  pickups: {
    title: 'Pickup Manager',
    path: '/pickup',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-listitem',
  },
  account: {
    title: 'Account',
    path: '/account',
    icon: <Bi.BiUser />,
    cName: 'nav-listitem',
  },
  driverPage: {
    title: 'Driver Page',
    path: '/driverPage',
    icon: <Bi.BiAdjust />,
    cName: 'nav-listitem',
  },
  createOrder: {
    title: 'Order',
    path: '/order',
    icon: <Bi.BiBookAdd />,
    cName: 'nav-listitem',
  },
  cart: {
    title: 'Cart',
    path: '/cart',
    icon: <Bi.BiCart />,
    cName: 'nav-listitem',
  },
  customers: {
    title: 'Customers',
    path: '/customers',
    icon: <Bi.BiGroup />,
    cName: 'nav-listitem',
  },
  crm: {
    title: 'Client Relations Manager',
    path: '/crm',
    icon: <Bi.BiGroup />,
    cName: 'nav-listitem',
  },
  claims: {
    title: 'Claim Manager',
    path: '/claims',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-listitem',
  },
  warehouse: {
    title: 'warehouse',
    path: '/warehouse',
    icon: <Bi.BiAlarm />,
    cName: 'nav-listitem',
  },
  adminstration: {
    title: 'Adminastration',
    path: '/sidebar',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-listitem',
  },
  support: {
    title: 'Support',
    path: '/support',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-listitem',
  },
  reports: {
    cName: 'nav-listitem',
    title: 'Reports',
    path: '/reports',
    icon: <Bi.BiAccessibility />,
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
