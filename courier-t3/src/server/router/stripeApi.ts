import { z } from 'zod'
import { createProtectedRouter } from './protected-routers'
import { Prisma } from '@prisma/client'
import { stripe } from 'server/stripe/client'
import type Stripe from 'stripe'
// STRIPE KEY TO CONNECT TO STRIPE BUISNESS ACCOUNT,

//only admin and allowed staff shouuld be able to use this one
export const stripeApi = createProtectedRouter()
  // deprecated part of project stripe item sync
  // .mutation('addProduct', {
  //   input: z.object({
  //     item_name: z.string(),
  //     item_price: z.number(),
  //     // item_type: z.string(),
  //   }),
  //   async resolve({ ctx, input }) {
  //     let createdStripeProduct
  //     try {
  //       createdStripeProduct = await stripe.products.create({
  //         name: input.item_name,
  //         default_price_data: {
  //           unit_amount: input.item_price,
  //           currency: 'usd',
  //         },
  //       })
  //       console.log(
  //         '🚀 ~ file: staffApi.ts ~ line 81 ~ resolve ~ createdStripeProduct',
  //         createdStripeProduct
  //       )
  //     } catch (error) {
  //       throw error
  //       // i could return or still add to database and add a column for i striped?
  //     }

  //     try {
  //       const newItem = await ctx.prisma.product.create({
  //         data: {
  //           name: input.item_name,
  //           price: input.item_price,
  //           // type: input.item_type,
  //           stripePriceId: createdStripeProduct.default_price?.toString(),
  //           stripeProductId: createdStripeProduct.id,
  //         },
  //       })
  //       console.log(
  //         '🚀 ~ file: staffApi.ts ~ line 100 ~ resolve ~ newItem',
  //         newItem
  //       )

  //       return newItem
  //     } catch (error) {
  //       console.error('delete product error', error)
  //     }
  //   },
  // })
  .mutation('createCheckoutSession', {
    input: z.object({
      userId: z.string(),
      customerId: z.string(),
      redirectUrl: z.string(),
      customerEmail: z.string(),
    }),
    async resolve({ ctx, input }) {
      const cartSession = await ctx.prisma.cart.findUnique({
        where: {
          creatingUserId_customerId: {
            creatingUserId: input.userId,
            customerId: input.customerId,
          },
        },
        select: {
          items: {
            select: {
              quantity: true,
              product: {
                select: {
                  name: true,

                  price: true,
                },
              },
            },
          },
        },
      })

      // format prisma items array to stripe checkout format
      let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
      cartSession?.items.forEach((item) => {
        lineItems.push({
          price_data: {
            currency: 'usd', // TODO: change depending on currency, might not be needed if USD is used for all transactions
            product_data: {
              name: item.product.name,
            },
            unit_amount: item.product.price,
          },
          quantity: item.quantity,
          adjustable_quantity: { enabled: false },
        })
      })

      // TODO: get  customer email to avoid rewritign

      // * Line Items : For payment mode, there is a maximum of 100 line items, however it is recommended to consolidate line items if there are more than a few dozen. For subscription mode, there is a maximum of 20 line items with recurring Prices and 20 line items with one-time Prices. Line items with one-time Prices will be on the initial invoice only.
      const stripeCheckoutSession = await stripe.checkout.sessions
        .create({
          success_url: `${process.env.NEXTAUTH_URL}/createOrder/orderCompleted?customerId=${input.customerId}&checkout=success`,
          cancel_url: `${process.env.NEXTAUTH_URL}${input.redirectUrl}?stripe=cancelled`,
          mode: 'payment',
          line_items: lineItems,
          customer_email: input.customerEmail,
          // automatic_tax: {
          //   enabled: true,
          // },
          expires_at: Math.floor(Date.now() / 1000) + 1800, //expires after 30mins,  defaults to 24 hours after session creation
          metadata: {
            //TODO: more descriptivve of the order, like the invoice receiept that is going to be printable
            test: 'meta Test',
            customerId: input.customerId,
            orderCreatorUserId: input.userId,
            // cart: JSON.stringify(cartSession),
          },
        })
        .catch((error) => {
          console.log(
            '🚀 ~ file: stripeApi.ts ~ line 128 ~ resolve ~ error',
            error
          )
        })
      // console.log(
      //   '🚀 ~ file: stripeApi.ts ~ line 147 ~ resolve ~ stripeCheckoutSession',
      //   stripeCheckoutSession
      // )

      // * note: checkoutSession values, after this only webhooks events will give me information on what is happening on stripes side,

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
            // stripeCheckout: checkout as unknown as Prisma.JsonObject,
          },
        })
        console.log(
          '🚀 ~ file: stripeApi.ts:180 ~ resolve ~ updatedInvoice:',
          updatedInvoice
        )

        return updatedInvoice
      }
      // change pending status and update stripeCheckoutJson
    },
  })

  // retrievve receipt using payment intent, currently receieving payment itent for invoices from checkout.session.completed
  .query('getReceiptUrl', {
    input: z.object({
      stripePaymentIntent: z.string(),
    }),
    async resolve({ ctx, input }) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        input.stripePaymentIntent
      )
      // console.log(
      //   '🚀 ~ file: stripeApi.ts:186 ~ resolve ~ paymentIntent:',
      //   paymentIntent
      // )

      const charge = await stripe.charges.retrieve(
        String(paymentIntent.latest_charge)
      )

      // console.log('receipt charge', charge)
      // // console.log({charge})
      return charge.receipt_url
    },
  })
