import React, { useRef } from 'react'
import { printDiv, printJsx } from './Print'

import ReactToPrint from 'react-to-print'

const InvoiceReceipt = (order) => {
  const componentRef = useRef()

  console.log(JSON.stringify(order))

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <button className="btn btn-blue">Print this out!</button>
        )}
        content={() => componentRef.current}
      />
      <div className="hidden">
        <Receipt ref={componentRef} order={order} />
      </div>
    </div>
  )
}

const Receipt = React.forwardRef((props, ref) => {
  return (
    <div className="" ref={ref}>
      <pre>{JSON.stringify(props.order, null, 2)}</pre>
    </div>
  )
})

Receipt.displayName = ' Invoice Receipt'

export default InvoiceReceipt
