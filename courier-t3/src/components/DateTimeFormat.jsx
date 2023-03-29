import React from 'react'

const DateTimeFormat = ({ pickupDatetime }) => {
  return (
    <div>
      <div>
        {pickupDatetime?.toLocaleDateString('en-us', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </div>
      <div>{pickupDatetime?.toLocaleTimeString('en-US')}</div>
    </div>
  )
}

export default DateTimeFormat
