import Stripe from 'stripe'
import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import { prisma } from '../../../server/db/client'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
// needed for raw request body
export const config = {
  api: {
    bodyParser: false,
  },
}
const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log('🚀 ~ file: webhook.ts ~ line 10 ~ webhook ~ req', req)

  let event: Stripe.Event

  const buf = await buffer(req)

  // if (process.env.STRIPE_WEBHOOK_SECRET) {
  let sig = req.headers['stripe-signature']
  // console.log('🚀 ~ file: webhook.ts ~ line 16 ~ webhook ~ sig', sig)
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!, //! TODO: not sure if this is buggy
      webhookSecret
    )
    // event = Stripe.Webhooks.
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  // console.log('🚀 ~ file: webhook.ts ~ line 24 ~ webhook ~ event', event)
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object
      console.log(
        '🚀 ~ file: webhook.ts ~ line 25 ~ webhook ~ checkoutSession',
        checkoutSession
      )

      //TODO: add stripe object and cart session for the correct customer Order

      const updatedOrderWithStripeCheckout = await prisma.order.update({
        where: {
          stripeCheckoutId: checkoutSession.id,
        },
        data: {
          stripeCheckout: checkoutSession,
          statusMessage: 'CHECKOUT SUCCESSFUL',
        },
      })
      console.log(
        '🚀 ~ file: webhook.ts ~ line 59 ~ webhook ~ updatedOrderWithStripeCheckout',
        updatedOrderWithStripeCheckout
      )

      // steps: create orders, proceed to checkout (stripe create checkout object returned here),
      // then proceed to completedOrder after checkout completes on stripe side (i dont think anything is return from stripe expect the query params send to success url when the checkout is completed, thus we neeed the webhook to provide the information),  using the metadata with customerid, stripe checkout and creatinUserId, i should be able to create the right order with the correct cart Details

      break
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      // Then define and call a function to handle the event payment_intent.succeeded
      console.log(
        '🚀 ~ file: webhook.ts ~ line 41 ~ webhook ~ paymentIntent',
        paymentIntent
      )

      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send('acknowledged')
}

export default webhook
