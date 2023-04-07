import EditOrderItems from '@/components/pages/invoices/edit/EditOrderItems'
import EditRecieverAddressForm from '@/components/pages/invoices/edit/EditRecieverAddress'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const EditInvoice = () => {
  const router = useRouter()
  const { orderId } = router.query

  const {
    data: order,
    status: getOrderDetailsStatus,
    refetch: refetchOrder,
  } = trpc.useQuery(['invoice.getOrderById', { orderId: orderId }], {
    refetchOnMount: 'always',
    enabled: !!router.query.orderId,
  })

  const [currentPage, setCurrentPage] = useState(1)
  function ComponentSwitcher() {
    switch (currentPage) {
      case 1:
        return (
          <EditRecieverAddressForm
            recieverAddress={order?.recieverAddress}
            orderId={orderId}
            refetchAddress={refetchOrder}
          />
        )
      case 2:
        return (
          <>
            <EditOrderItems order={order} refetchOrder={refetchOrder} />
          </>
        )
      default:
        return <h1>DEFAULT</h1>
    }
  }

  return (
    <div>
      <button
        className="btn bg-black text-white"
        onClick={() => {
          router.back()
        }}
      >
        back to invoice
      </button>
      <h1>Editing Invoice</h1>

      <nav className="flex flex-row gap-4">
        <button className="btn btn-blue" onClick={() => setCurrentPage(1)}>
          Reciever Form
        </button>
        <button className="btn btn-blue" onClick={() => setCurrentPage(2)}>
          Items
        </button>
      </nav>

      <div>
        <ComponentSwitcher />
      </div>
    </div>
  )
}

export default EditInvoice
