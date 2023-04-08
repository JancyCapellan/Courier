import { functionsIn } from 'lodash'
import { useMemo, useState, useEffect } from 'react'
import { useAsyncDebounce } from 'react-table'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const change = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Global Search:{' '}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          change(e.target.value)
        }}
        // placeholder={`${count} records...`}
        // style={{
        //   fontSize: '1.1rem',
        // }}
      />
    </span>
  )
}
export const ShowColumnFilter = ({ column }) => {
  // console.log({ column })
  return (
    <div>{column.canFilter && column.filter && column.render('Filter')}</div>
  )
}

export function dateBetweenFilterFn(rows, id, filterValues) {
  // * needed becase new Date with format yyyyddmm gives the day before the inputed date. mmddyyyy format gives the correct date
  // before using dayjs to simplfiy time
  function mmddyyyy(dateString) {
    const [year, month, day] = dateString.split('-')
    const formattedDate = [month, day, year].join('-')
    // console.log({ formattedDate })

    return formattedDate
  }

  function datesAreOnSameDay(first, second) {
    console.log({ first, second })

    // first.diff(second)

    // if (first.diff(second) === 0) return true
    // return (
    //   first.getFullYear() === second.getFullYear() &&
    //   first.getMonth() === second.getMonth() &&
    //   first.getDate() === second.getDate()
    // )
  }

  // console.log({ filterValues })

  let sd = filterValues[0]
    ? dayjs(filterValues[0]).format('MM/DD/YYYY')
    : undefined
  let ed = filterValues[1]
    ? dayjs(filterValues[1]).format('MM/DD/YYYY')
    : undefined

  console.log({ sd, ed })

  if (ed || sd) {
    return rows.filter((r) => {
      // console.log(r.values['pickupDate'])
      // format data
      // var dateAndHour = dayjs(r.values['pickupDate']).toDate()
      // var [month, day, year] = dateAndHour[0].split('/')
      // var date = [month, day, year].join('/')
      // // var date = dateAndHour[0]
      // var hour = dateAndHour[1]
      // var formattedData = date + ' ' + hour

      // console.log({ dateAndHour })
      // return
      // const cellDate = new Date(formattedData)

      const cellDate = dayjs(r.values['pickupDate']).format('MM/DD/YYYY')

      console.log({ cellDate })
      // if (ed && sd && datesAreOnSameDay(sd, ed))
      //   return datesAreOnSameDay(cellDate, sd)

      if (ed && sd) {
        console.log('ed && sd:', cellDate >= sd && cellDate <= ed)
        return cellDate >= sd && cellDate <= ed
      } else if (sd) {
        console.log('sd only:', cellDate >= sd)
        return cellDate >= sd
      } else {
        console.log('ed only:', cellDate <= ed)
        return cellDate <= ed
      }
    })
  } else {
    return rows
  }
}

export const DateTimeColumnFilter = ({
  setFilter,
  filterState,
  preFilteredRows,
}) => {
  // console.log({ preFilteredRows })

  const [filterValue, setFilterValue] = useState('')

  // console.log({ filterState })

  useEffect(() => {
    const datetimeFilterArray = filterState.filter(
      (obj) => obj.id === 'pickupDate'
    )
    if (datetimeFilterArray[0]) setFilterValue(datetimeFilterArray[0].value)
  }, [filterState])

  // useEffect(() => {
  //   console.log('filter value', filterValue)
  // }, [filterValue])

  return (
    <div>
      <p>filter pickup times: </p>
      <input
        // placeholder="dd-mm-yyyy"
        //min={min.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value //yyyy-mm-dd
          setFilter('pickupDate', (old = []) => [val ? val : undefined, old[1]])
        }}
        type="date"
        value={filterState[0]?.value[0] || ''}
      />
      <span className="ml-2 mr-2 font-bold">to</span>
      <input
        // placeholder="dd-mm-yyyy"
        //max={max.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value
          setFilter('pickupDate', (old = []) => [old[0], val ? val : undefined])
        }}
        type="date"
        value={filterState[0]?.value[1] || ''}
      />

      <button
        className="btn btn-blue"
        onClick={() => {
          setFilter('pickupDate', '')
        }}
      >
        reset
      </button>
    </div>
  )
}
