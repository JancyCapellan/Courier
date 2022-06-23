import React from 'react'
import { useAsyncDebounce } from 'react-table'

export const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const change = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{' '}
      <input
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
