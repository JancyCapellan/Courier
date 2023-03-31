import { useRouter } from 'next/router'
import React from 'react'

const EditInvoice = () => {
  const router = useRouter()

  console.log({ router })
  return (
    <div>
      EditInvoice
      <button
        onClick={() => {
          router.back()
        }}
      >
        back to invoice
      </button>
    </div>
  )
}

export default EditInvoice
