# TODAY'S TODO

1. add cart order to stripe payment testing
   1. can either add products to stripe dashbaord or can create using the api be reformatting the current products
   2. stripe is the center of truth for products but i should keep them synced with my local DB just in case. taking the priceId for each item from stripe and using that to checkout orders.
2. change cart to be based on userid, customerid, and cartid, that way admins dont see the same cart for every user

## today's to do in story

1. so today I want to sync the products with my database has the price ID from stripe
   and product ID from stripe synced with the stripe database,
2. I also want to be able to create straight customers from the customers in my database then I will be able to complete a check out order with the customer ID price ID and quantity for each order.

check out needs to get a list of items with stripePriceId:

```js
const session = await stripe.checkout.sessions.create({
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
  line_items: [{ price: 'price_H5ggYwtDq4fbrJ', quantity: 2 }],
  mode: 'payment',
})
```

## stripe notes

stripe adding items from frontend to avoid dupes and other issues, dashboard is available to change products but i will have to ask or see in testing what access other than the ones in use is needed

NOTE OF PRICES ON frontend:(tags: frontend, price format, usd centers) all pricning in the app is made on USC cents so 100 is 10000 cents, the front end must relfect that change when formattiong the number from

NOTE on logging:(frontend, logging after db reset) in with saved cookies after Database restarts, may not work as the cookies have change for securiy reasons, make it so this doesnt happen
