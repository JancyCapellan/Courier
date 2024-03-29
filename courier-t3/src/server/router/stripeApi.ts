import { z } from 'zod'
import { createProtectedRouter } from './protected-routers'
import Stripe from 'stripe'
import { Prisma } from '@prisma/client'

let stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
})
//only admin and allowed staff shouuld be able to use this one
export const stripeApi = createProtectedRouter()
  .mutation('addProduct', {
    input: z.object({
      item_name: z.string(),
      item_price: z.number(),
      // item_type: z.string(),
    }),
    async resolve({ ctx, input }) {
      let createdStripeProduct
      try {
        createdStripeProduct = await stripe.products.create({
          name: input.item_name,
          default_price_data: {
            unit_amount: input.item_price,
            currency: 'usd',
          },
        })
        console.log(
          '🚀 ~ file: staffApi.ts ~ line 81 ~ resolve ~ createdStripeProduct',
          createdStripeProduct
        )
      } catch (error) {
        throw error
        // i could return or still add to database and add a column for i striped?
      }

      try {
        const newItem = await ctx.prisma.product.create({
          data: {
            name: input.item_name,
            price: input.item_price,
            // type: input.item_type,
            stripePriceId: createdStripeProduct.default_price?.toString(),
            stripeProductId: createdStripeProduct.id,
          },
        })
        console.log(
          '🚀 ~ file: staffApi.ts ~ line 100 ~ resolve ~ newItem',
          newItem
        )

        return newItem
      } catch (error) {
        console.error('delete product error', error)
      }
    },
  })
  .mutation('createCheckoutSession', {
    input: z.object({
      userId: z.string(),
      customerId: z.string(),
      redirectUrl: z.string(),
    }),
    async resolve({ ctx, input }) {
      // get customer cart session to add to stripe checkout
      const cartSession = await ctx.prisma.cart.findUnique({
        where: {
          creatingUserId_customerId: {
            creatingUserId: input.userId,
            customerId: input.customerId,
          },
        },
        select: {
          // cartId: true,
          // customerId: true,
          // creatingUserId: true,
          items: {
            select: {
              quantity: true,
              product: {
                select: {
                  // name: true,
                  stripePriceId: true,
                  // stripeProductId: true,
                  // price: true,
                },
              },
            },
          },
          // addresses: {
          //   select: {
          //     firstName: true,
          //     lastName: true,
          //     address: true,
          //     address2: true,
          //     address3: true,
          //     city: true,
          //     state: true,
          //     postalCode: true,
          //     country: true,
          //     cellphone: true,
          //     telephone: true,
          //     recipient: true,
          //   },
          // },
        },
      })
      console.log(
        '🚀 ~ file: cartApi.ts ~ line 79 ~ resolve ~ cartSession',
        cartSession
      )

      // format prisma items array to stripe checkout format
      let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
      cartSession?.items.forEach((item) => {
        lineItems.push({
          price: item.product.stripePriceId!, // change prisma type string | null not string | undefined
          quantity: item.quantity,
          adjustable_quantity: { enabled: false },
        })
      })

      // * Line Items : For payment mode, there is a maximum of 100 line items, however it is recommended to consolidate line items if there are more than a few dozen. For subscription mode, there is a maximum of 20 line items with recurring Prices and 20 line items with one-time Prices. Line items with one-time Prices will be on the initial invoice only.
      const stripeCheckoutSession = await stripe.checkout.sessions
        .create({
          success_url: `${process.env.NEXTAUTH_URL}/createOrder/orderCompleted?customerId=${input.customerId}&checkout=success`,
          cancel_url: `${process.env.NEXTAUTH_URL}${input.redirectUrl}?stripe=cancelled`,
          mode: 'payment',
          line_items: lineItems,
          metadata: {
            //TODO: more descriptivve of the order, like the invoice receiept that is going to be printable
            test: 'meta Test',
            customerId: input.customerId,
            orderCreatorUserId: input.userId,
            cart: JSON.stringify(cartSession),
          },
        })
        .catch((error) => {
          console.log(
            '🚀 ~ file: stripeApi.ts ~ line 128 ~ resolve ~ error',
            error
          )
        })
      console.log(
        '🚀 ~ file: stripeApi.ts ~ line 127 ~ resolve ~ stripeCheckoutSession',
        stripeCheckoutSession
      )

      // checkoutSession values, after this only webhooks events will give me information on what is happening on stripes side,

      return stripeCheckoutSession
    },
  })
  .mutation('getStripeCheckoutDetailsFromStripe', {
    input: z.object({
      stripeCheckoutId: z.string(),
      status: z.string(),
    }),
    async resolve({ ctx, input }) {
      const checkout = await stripe.checkout.sessions.retrieve(
        input.stripeCheckoutId
      )
      console.log('🚀 ~ file: stripeApi.ts:158 ~ resolve ~ checkout', checkout)

      if (
        checkout.payment_status === 'paid' &&
        checkout.status === 'complete'
      ) {
        if (input.status === 'CHECKOUT SUCCESSFUL') return "Already Sync'd"

        const updatedInvoice = await ctx.prisma.order.update({
          where: {
            stripeCheckoutId: input.stripeCheckoutId,
          },
          data: {
            statusMessage: 'CHECKOUT SUCCESSFUL',
            stripeCheckout: checkout as unknown as Prisma.JsonObject,
          },
        })

        return updatedInvoice
      }
      // change pending status and update stripeCheckoutJson
    },
  })
