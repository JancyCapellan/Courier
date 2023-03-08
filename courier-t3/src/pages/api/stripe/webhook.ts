import { stripe } from '../../../server/stripe/client'
import type Stripe from 'stripe'
import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import { prisma } from '../../../server/db/client'
import {
  handleCheckoutSessionCompleted,
  handleCheckoutSessionExpired,
} from 'server/stripe/stripe-webhook-handlers'

// needed for raw request body
export const config = {
  api: {
    bodyParser: false,
  },
}
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

//helped with typing: https://blog.nickramkissoon.com/posts/integrate-stripe-t3#setting-up-a-webhook-endpoint-to-listen-to-stripe-events
const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log('🚀 ~ file: webhook.ts ~ line 10 ~ webhook ~ req', req)

  if (req.method === 'POST') {
    const buf = await buffer(req)
    let sig = req.headers['stripe-signature']

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig as string,
        webhookSecret
      )

      switch (event.type) {
        case 'checkout.session.completed':
          handleCheckoutSessionCompleted(event)

          break
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object
          // Then define and call a function to handle the event payment_intent.succeeded
          console.log('🚀 PaymentIntent', paymentIntent)

          break

        case 'checkout.session.expired':
          handleCheckoutSessionExpired(event)

          break

        default:
          //TODO: PINO LOGGER THIS
          console.log(`Unhandled event type ${event.type}`)
      }

      // stripe also have a very extensivve loggins system
      // record the event in the database
      // await prisma.stripeEvent.create({
      //   data: {
      //     id: event.id,
      //     type: event.type,
      //     object: event.object,
      //     api_version: event.api_version,
      //     account: event.account,
      //     created: new Date(event.created * 1000), // convert to milliseconds
      //     data: {
      //       object: event.data.object,
      //       previous_attributes: event.data.previous_attributes,
      //     },
      //     livemode: event.livemode,
      //     pending_webhooks: event.pending_webhooks,
      //     request: {
      //       id: event.request?.id,
      //       idempotency_key: event.request?.idempotency_key,
      //     },
      //   },
      // })

      // res.json({ received: true })
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send('acknowledged')
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default webhook
