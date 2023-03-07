import type { PrismaClient } from '@prisma/client'
import type Stripe from 'stripe'
import { getLogger } from '../../../logging/log-utils'
import { prisma } from 'server/db/client'
import { stripe } from './client'

const logger = getLogger('Stripe-Webhooks')

export const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  const checkoutSession = event.data.object as Stripe.Checkout.Session
  logger.info(checkoutSession)

  //TODO: add stripe object and cart session for the correct customer Order
  const updatedOrderWithStripeCheckout = await prisma.order.update({
    where: {
      stripeCheckoutId: checkoutSession.id,
    },
    data: {
      // stripeCheckout: checkoutSession,
      status: {
        connectOrCreate: {
          where: {
            message: 'CHECKOUT SUCCESSFUL',
          },
          create: {
            message: 'CHECKOUT SUCCESSFUL',
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
