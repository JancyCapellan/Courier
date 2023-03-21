import { functionsIn } from 'lodash'
import { useMemo, useState, useEffect } from 'react'
import { useAsyncDebounce } from 'react-table'

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
  function mmddyyyy(dateString) {
    const [year, month, day] = dateString.split('-')
    const formattedDate = [month, day, year].join('-')
    // console.log({ formattedDate })

    return formattedDate
  }

  function datesAreOnSameDay(first, second) {
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    )
  }

  let sd = filterValues[0] ? new Date(mmddyyyy(filterValues[0])) : undefined
  let ed = filterValues[1] ? new Date(mmddyyyy(filterValues[1])) : undefined

  if (ed || sd) {
    return rows.filter((r) => {
      // format data
      var dateAndHour = r.values['timePlaced'].split(',')
      var [month, day, year] = dateAndHour[0].split('/')
      var date = [month, day, year].join('/')
      // var date = dateAndHour[0]
      var hour = dateAndHour[1]
      var formattedData = date + ' ' + hour

      const cellDate = new Date(formattedData)

      if (ed && sd && datesAreOnSameDay(sd, ed))
        return datesAreOnSameDay(cellDate, sd)

      if (ed && sd) {
        return cellDate >= sd && cellDate <= ed
      } else if (sd) {
        return cellDate >= sd
      } else {
        return cellDate <= ed
      }
    })
  } else {
    return rows
  }
}

export const DateTimeColumnFilter = ({ setFilter, filterState }) => {
  // console.log({ filterState })

  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    const datetimeFilterArray = filterState.filter(
      (obj) => obj.id === 'timePlaced'
    )
    if (datetimeFilterArray[0]) setFilterValue(datetimeFilterArray[0].value)
  }, [filterState])

  // useEffect(() => {
  //   console.log('filter value', filterValue)
  // }, [filterValue])

  return (
    <div>
      <input
        // placeholder="dd-mm-yyyy"
        //min={min.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value //yyyy-mm-dd
          setFilter('timePlaced', (old = []) => [val ? val : undefined, old[1]])
        }}
        type="date"
        value={filterValue[0] || ''}
      />
      <span className="ml-2 mr-2 font-bold">to</span>
      <input
        // placeholder="dd-mm-yyyy"
        //max={max.toISOString().slice(0, 10)}
        onChange={(e) => {
          const val = e.target.value
          setFilter('timePlaced', (old = []) => [old[0], val ? val : undefined])
        }}
        type="date"
        value={filterValue[1] || ''}
      />

      <button
        className="btn btn-blue"
        onClick={() => {
          setFilter('timePlaced', '')
        }}
      >
        reset
      </button>
    </div>
  )
}
