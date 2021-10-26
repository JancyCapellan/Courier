import React from 'react'
import * as Bi from 'react-icons/bi'

// cname is className
// { staff:[], cust: [], admin:[]}
const routes = {
  account: {
    title: 'Account',
    path: '/accountInfo',
    icon: <Bi.BiUser />,
    cName: 'nav-text',
  },
  administration: {
    title: 'Admin',
    path: '/administration',
    icon: <Bi.BiUser />,
    cName: 'nav-text',
  },
  pickups: {
    title: 'Pickup Manager',
    path: '/pickup',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-text',
  },
  // part  of warehouse now
  // drivers: {
  //   title: 'Drivers',
  //   path: '/account',
  //   icon: <Bi.BiAccessibility />,
  //   cName: 'nav-text',
  // },
  // trucks: {
  //   title: 'Trucks',
  //   path: '/account',
  //   icon: <Bi.BiAccessibility />,
  //   cName: 'nav-text',
  // },
  logout: {
    title: 'Logout',
    path: '/',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-text',
  },
  createOrder: {
    title: 'Create Order',
    path: '/createorder',
    icon: <Bi.BiBookAdd />,
    cName: 'nav-text',
  },
  cart: {
    title: 'Cart',
    path: '/cart',
    icon: <Bi.BiCart />,
    cName: 'nav-text',
  },
  customers: {
    title: 'Customers',
    path: '/customers',
    icon: <Bi.BiGroup />,
    cName: 'nav-text',
  },
  claims: {
    title: 'Claim Manager',
    path: '/claims',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-text',
  },
  warehouse: {
    title: 'Warehouse Manger',
    path: '/warehouse',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-text',
  },
  adminstration: {
    title: 'Adminastration',
    path: '/sidebar',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-text',
  },
  support: {
    title: 'Support',
    path: '/support',
    icon: <Bi.BiAccessibility />,
    cName: 'nav-text',
  },
}
export const sidebarTypes = {
  STAFF: [routes.account, routes.pickups, routes.warehouse, routes.logout],
  CUST: [routes.account, routes.createOrder, routes.cart, routes.support, routes.logout],
  ADMIN: [
    routes.administration,
    routes.account,
    routes.customers,
    routes.pickups,
    routes.warehouse,
    routes.support,
    routes.logout,
  ],
}
