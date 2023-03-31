import React, { useRef } from 'react'
import { printDiv, printJsx } from './Print'
import { QRCodeSVG } from 'qrcode.react'
import ReactToPrint from 'react-to-print'

const InvoiceReceipt = (order) => {
  const componentRef = useRef()

  // console.log(JSON.stringify(order))

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
      {/* <pre>{JSON.stringify(props.order, null, 2)}</pre> */}
      <pre>
        OrderID: {props.order?.id}
        {/* <DateTimeFormat pickupDatetime={props.order?.pickupDatetime} /> */}
        {'\n'}Sender:{props.order?.customer?.firstName}{' '}
        {props.order?.customer?.lastName}
        {'\n'} Country: {props.order?.shipperAddress?.country}
        {'\n'} Address: {props.order?.shipperAddress?.address}
        {'\n'} Address2: {props.order?.shipperAddress?.address2 || 'N/A'}
        {'\n'} Address3: {props.order?.shipperAddress?.address3 || ' N/A'}
        {'\n'} City: {props.order?.shipperAddress?.city}
        {'\n'} PostalCode: {props.order?.shipperAddress?.postalCode}
        {'\n'} Cellphone: {props.order?.shipperAddress?.cellphone || 'N/A'}
        {'\n'} Telephone: {props.order?.shipperAddress?.telephone || 'N/A'}
        {'\n'}Reciever: {props.order?.recieverAddress?.firstName}
        {'\n'} Country: {props.order?.recieverAddress?.country}
        {'\n'} Address: {props.order?.recieverAddress?.address}
        {'\n'} Address2: {props.order?.recieverAddress?.address2 || 'N/A'}
        {'\n'} Address3: {props.order?.recieverAddress?.address3 || ' N/A'}
        {'\n'} City: {props.order?.recieverAddress?.city}
        {'\n'} PostalCode: {props.order?.recieverAddress?.postalCode}
        {'\n'} Cellphone: {props.order?.recieverAddress?.cellphone || 'N/A'}
        {'\n'} Telephone: {props.order?.recieverAddress?.telephone || 'N/A'}
        {'\n'}
        {'\n'}
        {/* route: {order.routeId} {'\n'} */}
      </pre>
      {/* 
      <QRCodeSVG
        value={`OrderID:${props.order?.id}\nSender:${
          props.order?.customer?.firstName
        } ${props.order?.customer?.lastName}\n  Country: ${
          props.order?.shipperAddress?.country
        }\n  Address: ${props.order?.shipperAddress?.address}\n  Address2: ${
          props.order?.shipperAddress?.address2 || 'N/A'
        }\n  Address3: ${
          props.order?.shipperAddress?.address3 || ' N/A'
        }\n  City: ${props.order?.shipperAddress?.city}\n  PostalCode: ${
          props.order?.shipperAddress?.postalCode
        }\n  Cellphone: ${
          props.order?.shipperAddress?.cellphone || 'N/A'
        }\n  Telephone: ${
          props.order?.shipperAddress?.telephone || 'N/A'
        }\nReciever: ${props.order?.recieverAddress?.firstName}\n  Country: ${
          props.order?.recieverAddress?.country
        }\n  Address: ${props.order?.recieverAddress?.address}\n  Address2: ${
          props.order?.recieverAddress?.address2 || 'N/A'
        }\n  Address3: ${
          props.order?.recieverAddress?.address3 || ' N/A'
        }\n  City: ${props.order?.recieverAddress?.city}\n  PostalCode: ${
          props.order?.recieverAddress?.postalCode
        }\n  Cellphone: ${
          props.order?.recieverAddress?.cellphone || 'N/A'
        }\n  Telephone: ${props.order?.recieverAddress?.telephone || 'N/A'}`}
        includeMargin={true}
        level={'H'}
        size={225}
      /> */}
    </div>
  )
})

Receipt.displayName = ' Invoice Receipt'

export default InvoiceReceipt
