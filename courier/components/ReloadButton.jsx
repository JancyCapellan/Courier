import React from 'react'
import router from 'next/router'

const ReloadButton = () => {
  return (
    <div>
      <button onClick={() => router.reload()}>reload test</button>
    </div>
  )
}

export default ReloadButton
