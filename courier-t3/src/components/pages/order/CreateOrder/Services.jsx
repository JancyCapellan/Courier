import React from 'react'
// import '../../index.css'

const items = {
  Boxes: ['food', 'clothes', 'electronics', 'Misc'],
  Containers: [],
}

//creates a list of items/services available for order
const Services = () => {
  return (
    <>
      <h1> Create Order</h1>
      <section>
        <h2> Items</h2>
        <div className="createOrderTitles">Boxes</div>
        <div> </div>
        <div className="createOrderTitles">Containers</div>
        <div className="createOrderTitles">Items</div>
      </section>
      <section>
        <h2> Delviery Information</h2>
      </section>
    </>
  )
}

export default Services
