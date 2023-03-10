import type { PrismaClient } from '@prisma/client'
import type Stripe from 'stripe'
import { getLogger } from '../../../logging/log-utils'
import { prisma } from 'server/db/client'
import { stripe } from './client'
import Checkout from 'pages/createOrder/checkout/[customerId]'

const logger = getLogger('Stripe-Webhooks')

export const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  // logger.info(checkoutSession)

  //TODO: add stripe object and cart session for the correct customer Order
  const updatedOrderWithStripeCheckout = await prisma.order.update({
    where: {
      stripeCheckoutId: checkoutSession.id,
    },
    data: {
      // stripeCheckout: checkoutSession,
      stripePaymentIntent: String(checkoutSession.payment_intent),
      status: {
        connectOrCreate: {
          where: {
            message: checkoutSession.payment_status,
          },
          create: {
            message: checkoutSession.payment_status,
          },
        },
      },
    },
  })
  console.log(
    '🚀 ~ file: webhook.ts ~ line 59 ~ webhook ~ updatedOrderWithStripeCheckout',
    updatedOrderWithStripeCheckout
  )
}

export const handleChargeSucceded = async (event: Stripe.Event) => {
  try {
    const chargeSucceded = event.data.object as Stripe.Charge

    if (!chargeSucceded.payment_intent)
      return console.log(
        'CHARGE succeeded but local order does not have paymentIntentId'
      )

    const updateOrderWithRecieptInfo = await prisma.order.update({
      where: {
        // stripeCheckoutId: checkoutSession.id,
        // stripePaymentIntent: String(chargeSucceded.payment_intent),
      },
      data: {
        // stripeCheckout: checkoutSession,
        stripeReceiptUrl: chargeSucceded.receipt_url,
        status: {
          connectOrCreate: {
            where: {
              message: 'Stripe Checkout succeeded',
            },
            create: {
              message: 'Stripe Checkout succeeded',
            },
          },
        },
      },
    })

    return updateOrderWithRecieptInfo
  } catch (error) {
    console.error(error)
  }
}

export const handleCheckoutSessionExpired = async (event: Stripe.Event) => {
  const expiredCheckoutSession = event.data.object as Stripe.Checkout.Session

  try {
    const removedCheckoutSession = await prisma.order.delete({
      where: {
        stripeCheckoutId: expiredCheckoutSession.id,
      },
    })

    return removedCheckoutSession
    // logger.info(removedCheckoutSession)
  } catch (err) {
    // logger.error(err)
    console.error(err)
  }
}

export const handlePaymentIntentSucceeded = async (event: Stripe.Event) => {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  // const updatedPendingCheckout = await prisma.order.update({})
}
