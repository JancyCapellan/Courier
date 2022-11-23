import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

const Index = () => {
  // after checkout returns successful, delete cart for customer, so customerId is needed, but i want to make sure that the cart session/checkout session is saved onto the courier_app database then it should show up in invoice page.
  const [redirectSeconds, setRedirectSeconds] = useState(10)

  const router = useRouter()
  const { customerId, checkout } = router.query

  const { data: session, status: sessionStatus } = useSession()
  const createOrder = trpc.useMutation(['cart.createOrderAfterCheckout'])

  // useEffect(() => {
  //   if (
  //     customerId &&
  //     checkout === 'success' &&
  //     sessionStatus === 'authenticated'
  //   ) {
  //     createOrder.mutate(
  //       { customerId: customerId, userId: session?.user?.id },
  //       {
  //         // onSettled: () => console.log('tried createOrder'),
  //         onSuccess: () => console.log('succedded creating'),
  //         onError: (err) => {
  //           console.log('🚀 ~ file: index.jsx ~ line 29 ~ useEffect ~ err', err)
  //         },
  //       }
  //     )
  //   }

  //   if (!customerId) console.log('NO CUSTOMER ID IN QUERY PARAMETERS')
  //   //? should i redirect after order is made or wait for the timer

  //   // return () => {
  //   //   second`
  //   // }
  // }, [checkout, customerId, sessionStatus])

  useEffect(() => {
    if (checkout) {
      if (redirectSeconds == 0) {
        // TODO: user role determines where they get redirected
        router.push('/account')
        return
      }

      setTimeout(() => {
        console.log(redirectSeconds)
        setRedirectSeconds((redirectSeconds) => redirectSeconds - 1)
      }, 1000)
    }
  }, [redirectSeconds, checkout])

  if (checkout !== 'success') {
    return (
      <div>
        Checkout redirected here but according to Stripes checkout something
        went wrong and there wasnt a checkout completed successfully
      </div>
    )
  }
  return (
    <div>
      <p>Completed Order Checkout, check the order status in Invoices tab.</p>
      <p>CountDown: {redirectSeconds}</p>
    </div>
  )
}

export default Index
