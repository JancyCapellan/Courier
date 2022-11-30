// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
// import getStripe from '@/utils/get-stripejs'
// import { Stripe } from '@stripe/stripe-js'
// import type Stripe from 'stripe'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
})
export default async function handler(req, res) {
  // const stripe = await getStripe()

  if (req.method === 'POST') {
    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'donate',
        payment_method_types: ['card'],
        line_items: [
          {
            name: 'Custom amount donation',
            amount: 1000, //$100.00
            currency: 'usd',
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      }
      const myparams: Stripe.Checkout.SessionCreateParams = {
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1LzpCBAVJ8VmRrvG4cyBw6Ar',
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      }

      const checkoutSession: Stripe.Checkout.Session =
        await stripe?.checkout.sessions.create(params)

      // Create Checkout Sessions from body params.
      // const session = await stripe.checkout.sessions.create({
      //   line_items: [
      //     {
      //       // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
      //       price: 'price_1LzpCBAVJ8VmRrvG4cyBw6Ar',
      //       quantity: 1,
      //     },
      //   ],
      //   mode: 'payment',
      //   success_url: `${req.headers.origin}/?success=true`,
      //   cancel_url: `${req.headers.origin}/?canceled=true`,
      // })
      // res.redirect(303, session.url)
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
