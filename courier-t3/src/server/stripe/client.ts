import Stripe from 'stripe'

// TODO: (explore this idea more) NEEDS TO BE DIFFERENT FOR EACH TENANT/CLIENT. as does the prisma schema database url. a matter of changing the configs used by the logged in user. based on their tenant/client code
export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY!), {
  apiVersion: '2022-11-15',
})
