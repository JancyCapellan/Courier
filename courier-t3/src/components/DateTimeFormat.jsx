import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

const DateTimeFormat = ({ pickupDate, pickupTime }) => {
  // console.log({ pickupDate, pickupTime })

  dayjs.extend(utc)

  let isoDate
  isoDate = dayjs.utc(pickupDate).format('dddd, MMMM D, YYYY')

  // isoDate = pickupDatetime.toISOString()

  // console.log({ isoDate })

  return (
    <div>
      {isoDate} <span className="font-bold"> {pickupTime}</span>
    </div>
  )
}

export default DateTimeFormat
