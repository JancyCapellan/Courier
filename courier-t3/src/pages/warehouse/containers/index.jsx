import { useRouter } from 'next/router'
import React from 'react'

const Containers = () => {
  const router = useRouter()

  // new containers are made whenver one comes in for filling, never seen more than one at a time but lets scale up for this.
  // the order is made, the driver is set, must add pickZone, time to pic up?.

  // when package arrives, it is scanned where its location is updated, along with status, and it is scanned into the container.

  // one scan or press to pick container,

  // scan package open a page with a choosep

  return (
    <div className="flex flex-col">
      <button
        className="btn btn-blue w-max hover:bg-red-300"
        onClick={() => {
          router.push({ pathname: '/warehouse' })
        }}
      >
        go back to warehouse
      </button>

      <div>
        {/* <button>
          Scan QR and create container
        </button> */}
        <button>Create new Container</button>
      </div>
    </div>
  )
}

export default Containers
