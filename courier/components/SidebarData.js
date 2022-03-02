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
  // part  of warehouse now
  // drivers: {
  //   title: 'Drivers',
  //   path: '/account',
  //   icon: <Bi.BiAccessibility />,
  //   cName: 'nav-listitem',
  // },
  // trucks: {
  //   title: 'Trucks',
  //   path: '/account',
  //   icon: <Bi.BiAccessibility />,
  //   cName: 'nav-listitem',
  // },
  logout: {
    title: 'Logout',
    path: '/',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-listitem',
  },
  createOrder: {
    title: 'Create Order',
    path: '/createorder',
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
  claims: {
    title: 'Claim Manager',
    path: '/claims',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-listitem',
  },
  warehouse: {
    title: 'Branch Manager',
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
}
export const sidebarTypes = {
  SECT: [routes.account, routes.customers, routes.invoices, routes.warehouse],
  DRIVER: [routes.account, routes.pickups, routes.warehouse],
  CUST: [routes.account, routes.createOrder, routes.cart, routes.support],
  ADMIN: [
    routes.administration,
    routes.account,
    routes.customers,
    routes.invoices,
    routes.warehouse,
  ],
  All: [routes],
}
