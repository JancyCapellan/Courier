import { trpc } from '@/utils/trpc'
import { useState } from 'react'

const EditOrderItems = ({ order, refetchOrder }) => {
  // console.log({ orderItems })

  // const [convertedCartItems, setconvertedCartItems] = useState([])

  const {
    data: allProducts,
    status: allProductsStatus,
    refetch: refetchProducts,
  } = trpc.useQuery(['public.getProducts'])

  return (
    <>
      <h2>EditOrderItems</h2>
      {/* <table className="w-max">
        <caption>Current Order Items</caption>
        <thead>
          <tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Per Item Price</th>
            <th>grouped price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => {
            return (
              <tr key={item.product.name}>
                <td>{item.product.name}</td>
                <td>{item.quantity}</td>
                <td>${item.product.price / 100}</td>
                <td> ${(item.product.price * item.quantity) / 100}</td>
              </tr>
            )
          })}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>total: ${(order?.totalCost / 100).toLocaleString('en')}</td>
          </tr>
        </tbody>
      </table> */}
      <h4>Total Cost: ${(order?.totalCost / 100).toLocaleString('en')}</h4>
      {order.items.map((orderItem) => {
        return (
          <OrderItems
            key={orderItem.productId}
            {...orderItem}
            orderId={order?.orderId}
            // cartId={cartSession.cartId}
            refetchOrder={refetchOrder}
          />
        )
      })}
      <section className="items-section">
        <div className="itemsList">
          {allProductsStatus === 'success' ? (
            allProducts.map((product) => {
              return (
                <Product
                  key={product.id}
                  {...product}
                  orderId={order?.orderId}
                  refetchOrder={refetchOrder}
                />
              )
            })
          ) : (
            <></>
          )}
        </div>
      </section>
    </>
  )
}

export default EditOrderItems

const Product = ({ name, price, id, orderId, refetchOrder }) => {
  const [qty, setQty] = useState('1')

  // const addItemToCart = usePersistedLocallyStore((state) => state.addItemToCart)
  // the cart is local for the current page, but i want it to be on DB

  // const refetchCart = useGlobalStore((state) => state.refetchCart)
  const addProductToOrder = trpc.useMutation(['invoice.addProductToOrder'], {
    onSuccess: () => refetchOrder(),
  })

  // const session = useSession()
  // const { data: session, status } = useSession()
  // console.log('item currentUserSession', session)

  // item to add to cart that will be submitted for order,
  let item = {
    quantity: parseInt(qty),
    productId: id,
  }

  // if (qty === 1)
  return (
    <article className="">
      <div className="">
        {name}: ${price / 100}
      </div>
      <label htmlFor="quantity">
        <input
          type="number"
          id="quantity"
          name="quantity"
          onChange={(e) => {
            console.log('qty change')
            setQty(e.target.value)
          }}
          defaultValue={1}
          min="1"
        />
      </label>
      <button
        className=""
        onClick={() => {
          addProductToOrder.mutate({
            orderId: orderId,
            item: item,
          })
        }}
      >
        add to cart
      </button>
    </article>
  )
}

const OrderItems = ({
  productId,
  quantity,
  product,
  orderId,
  id,
  refetchOrder,
}) => {
  const removeEnitreItemFromCart = trpc.useMutation(
    ['invoice.removeEnitreItemFromOrder'],
    {
      onSuccess: () => refetchOrder(),
    }
  )

  const removeItemFromCart = trpc.useMutation(['invoice.removeItemFromOrder'], {
    onSuccess: () => refetchOrder(),
  })

  const addOneCartItem = trpc.useMutation(['invoice.addOneItem'], {
    onSuccess: () => refetchOrder(),
  })

  return (
    <article className="">
      <p>
        <b>{product.name}</b>
      </p>
      <div>
        <div className="item-price">${product.price / 100}</div>
        {/* remove button */}
        <button
          className="remove-btn"
          onClick={() => {
            removeEnitreItemFromCart.mutate({
              // cartItemId: id,
              orderId: orderId,
              productId: productId,
            })
          }}
        >
          remove
        </button>
      </div>
      <div>
        {/* increase amount */}
        <button
          className="amount-btn"
          onClick={() =>
            addOneCartItem.mutate({
              productId: productId,
              orderId: orderId,
            })
          }
        >
          +
        </button>
        <p className="amount">{quantity}</p>
        {/* decrease amount */}
        <button
          className="amount-btn"
          onClick={() => {
            removeItemFromCart.mutate({
              cartItemId: id,
              orderId: orderId,
            })
          }}
        >
          -
        </button>
      </div>
    </article>
  )
}
