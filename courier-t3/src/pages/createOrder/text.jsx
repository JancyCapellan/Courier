import Cart from '@/components/pages/order/CreateOrder/Cart'
import { now } from 'next-auth/client/_utils'
import React from 'react'

const text = () => {
  const timeNow = now()
  return <div>{timeNow}</div>
}

export default text
