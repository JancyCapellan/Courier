import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

const DateTimeFormat = ({ pickupDatetime }) => {
  console.log({ pickupDatetime })

  dayjs.extend(utc)

  let isoDate
  isoDate = dayjs.utc(pickupDatetime).format('dddd, MMMM D, YYYY h:mm A')

  // isoDate = pickupDatetime.toISOString()

  console.log({ isoDate })

  return <div>{isoDate}</div>
}

export default DateTimeFormat
