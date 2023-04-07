import React from 'react'

const EditOrderItems = ({ orderItems }) => {
  console.log({ orderItems })

  // const [convertedCartItems, setconvertedCartItems] = useState([])

  return (
    <>
      <div>EditOrderItems</div>
      <table className="w-max">
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
          {orderItems.map((item) => {
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
            {/* <td>total: ${(order?.totalCost / 100).toLocaleString('en')}</td> */}
            {/* TODO: calculate total amount due for all items in the order */}
            {/* <td>{order.totalPrice}</td> */}
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default EditOrderItems
