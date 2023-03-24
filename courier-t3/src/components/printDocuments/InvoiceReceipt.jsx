import React from 'react'
import { printDiv, printJsx } from './Print'

const InvoiceReceipt = (order) => {
  return (
    <>
      <div id="receipt" className="border-2 border-black">
        <div id="printableArea">
          <h1>Receipt</h1>
        </div>
      </div>
      <button
        className="btn btn-blue"
        onClick={() => {
          printDiv('receipt')
        }}
      >
        Print Order
      </button>
    </>
  )
}

export default InvoiceReceipt
