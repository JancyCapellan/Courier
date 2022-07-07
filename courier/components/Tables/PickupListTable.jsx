/* eslint-disable react/jsx-key */
import React from 'react'
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  useRowSelect,
} from 'react-table'
import { useQuery, useMutation } from 'react-query'
import axios from 'axios'
import { GlobalFilter } from './tableFilters'
import { useRouter } from 'next/router'
import { backendClient } from '../axiosClient.mjs'

const IndeterminateCheckbox = React.forwardRef(function ICheckbox({ indeterminate, ...rest }, ref) {
  const defaultRef = React.useRef()
  const resolvedRef = ref || defaultRef

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input type='checkbox' ref={resolvedRef} {...rest} />
    </>
  )
})

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// Create an editable cell renderer
const EditableCell = ({
  cell: { value: initialValue },
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  editable,
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value)
  }

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (!editable) {
    return `${initialValue}`
  }

  return <input value={value} onChange={onChange} onBlur={onBlur} />
}
// const driverSelectOptions = [
//   { key: 'Admin', value: 'ADMIN' },
//   { key: 'Staff', value: 'STAFF' },
//   { key: 'Driver', value: 'DRIVER' },
// ]

const PickupListTable = () => {
  const [multiSelectPickupDriver, setMultiSelectPickupDriver] = React.useState()
  const router = useRouter()

  const getOrderOptions = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/order/options/all')
      return data
    } catch (error) {
      throw new Error(`API error:${error?.message}`)
    }
  }
  const {
    data: orderOptions,
    isSuccess: orderOptionsIsSuccess,
    isLoading: orderOptionIsLoading,
    error: orderOptionsError,
  } = useQuery('getOrderOptions', () => getOrderOptions(), {
    keepPreviousData: true,
    staleTime: Infinity,
  })

  const getAllOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/order/allOrders')
      return data
    } catch (error) {
      throw new Error(`API error:${error?.message}`)
    }
  }
  const {
    data: pickupListTable,
    isSuccess,
    isLoading,
    error,
  } = useQuery('getAllOrders', () => getAllOrders(), {
    keepPreviousData: true,
    staleTime: Infinity,
  })

  // to use data have to make status check for each call, consolidating calls into one route will remvoe those multiple calls but i will have to make a new router and return a new shape for the entire page. currently trying to

  const mutationPickupDriver = useMutation(
    async ({ orderId, newPickUpDriverId }) => {
      // change pickup order for order after single selection

      console.log('newpickupdriverid', newPickUpDriverId, orderId)
      const { data } = await backendClient.put(`order/update/${orderId}`, {
        driverId: newPickUpDriverId,
      })
      console.log('updated pickup', data)
      return data
    },
    {
      onSuccess: (data) => {
        // queryClient.setQueryData(['getAllOrders', currentCustomer.id], (oldData) => {
        //   return [...oldData, data]
        // })
        // alert('user info edit completed')
      },
    }
  )
  const mutationManyPickupDriver = useMutation(
    async ({ orderIds, newPickUpDriverId }) => {
      // change pickup order for order after single selection

      console.log('newpickupdriverid', newPickUpDriverId, orderIds)
      const { data } = await backendClient.put(`order/update/pickupDriver/many`, {
        ids: orderIds,
        driverId: newPickUpDriverId,
      })
      // console.log('updated pickup', data)
      return data
    },
    {
      onSuccess: (data) => {
        // queryClient.setQueryData(['getAllOrders', currentCustomer.id], (oldData) => {
        //   return [...oldData, data]
        // })
        // alert('user info edit completed')
      },
    }
  )

  // * dynamic cells for pickupzone and drivers that updates the memoization whenever orderOptions are fetched successfully
  const columns = React.useMemo(
    () => [
      {
        Header: 'OrderId',
        accessor: 'id',
      },
      {
        Header: 'PickupZone',
        accessor: 'pickupZoneId',
        Cell: ({ row: { original } }) => (
          <>
            {orderOptionsIsSuccess ? (
              <select
                onChange={(e) => {
                  // mutationPickupDriver.mutate(original.id, e.target.value)
                }}
              >
                {orderOptions.pickupZones.map((zone) => (
                  <option key={`${zone.code}${zone.id}`} value={zone.code}>
                    {zone.Name}
                  </option>
                ))}

                {/* {driverSelectOptions.map((key, val) => (
                <option key={key}>{val}</option>
              ))} */}
              </select>
            ) : (
              <></>
            )}
            {/* change driver on change but edit mode must be on?, change driver after pressing ok? */}
          </>
        ),
      },
      {
        Header: 'Driver',
        accessor: (data) => {
          if (data.pickupdriver === null) return 'NONE'
          return `${data.pickupdriver?.firstName} ${data.pickupdriver?.lastName}`
        },
        Cell: ({ row: { original } }) => (
          <>
            {orderOptionsIsSuccess ? (
              <select
                onChange={(e) => {
                  console.log('pickup driver id', e.target.value)
                  mutationPickupDriver.mutate({
                    orderId: original.id,
                    newPickUpDriverId: e.target.value,
                  })
                }}
              >
                <option value={original.pickupDriverId}>
                  current: {original.pickupdriver?.firstName} {original.pickupdriver?.lastName}
                </option>
                {orderOptions.drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName}
                  </option>
                ))}

                {/* {driverSelectOptions.map((key, val) => (
                <option key={key}>{val}</option>
              ))} */}
              </select>
            ) : (
              <></>
            )}
          </>
        ),
      },
      {
        Header: 'Shipped To',
        accessor: (data) => `${data.recieverFirstName} ${data.recieverLastName}`,
      },
      {
        Header: 'Time placed',
        accessor: 'timePlaced',
      },
      { Header: 'Total Items', accessor: 'totalItems' },
      {
        Header: 'Total Price',
        accessor: 'totalPrice',
      },
      {
        Header: 'Status',
        accessor: 'status.message',
      },
      {
        Header: 'utility',
        Cell: ({ row: { original } }) => (
          <>
            <button
              onClick={() =>
                router.push({
                  pathname: `/Invoices/${original.id}`,
                })
              }
            >
              Invoice page
            </button>
          </>
        ),
      },
    ],
    [orderOptionsIsSuccess]
  )
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      //  fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  // console.log(pickupListTable)

  const tableData = React.useMemo(() => {
    if (!pickupListTable) return []
    return pickupListTable
  }, [pickupListTable])

  // console.log('invoices', pickupListTable)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    // footerGroups,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    // pageCount,
    setGlobalFilter,
    // gotoPage,
    // nextPage,
    // previousPage,
    // setPageSize,
    // state: { pageIndex, pageSize, globalFilter },
    // visibleColumns,
    state,
    selectedFlatRows,
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data: tableData,
      // filterTypes,
    },
    useGlobalFilter,
    useSortBy,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          // Header: ({ getToggleAllRowsSelectedProps }) => (
          //   <div>
          //     <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          //   </div>
          // ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },

        ...columns,
      ])
      // hooks.visibleColumns.push((columns) => [
      //   ...columns,
      //   {
      //     Header: 'PickupZone',
      //     accessor: 'pickupZoneId',
      //     Cell: ({ row: { original } }) => (
      //       <>
      //         {orderOptionsIsSuccess ? (
      //           <select>
      //             <option key={'BX'}>Bronx</option>
      //             {/* {driverSelectOptions.map((key, val) => (
      //           <option key={key}>{val}</option>
      //         ))} */}
      //           </select>
      //         ) : (
      //           <></>
      //         )}
      //         {/* change driver on change but edit mode must be on?, change driver after pressing ok? */}
      //       </>
      //     ),
      //   },
      //   {
      //     Header: 'Driver',
      //     accessor: (data) => {
      //       if (data.pickupdriver === null) return 'NONE'
      //       return `${data.pickupdriver?.firstName} ${data.pickupdriver?.lastName}`
      //     },
      //     Cell: ({ row: { original } }) => (
      //       <>
      //         {/* change driver on change but edit mode must be on?, change driver after pressing ok? */}
      //         <select>
      //           <option key={'driver tester'}>Driver Tester</option>
      //           {/* {driverSelectOptions.map((key, val) => (
      //           <option key={key}>{val}</option>
      //         ))} */}
      //         </select>
      //       </>
      //     ),
      //   },
      // ])
    }
    // usePagination
  )

  //  add to filter by order branch location, date to date, orders shown by drivers
  return (
    <>
      {isSuccess ? (
        <>
          <h1></h1>
          <GlobalFilter
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            preGlobalFilteredRows={preGlobalFilteredRows}
          />

          {orderOptionsIsSuccess ? (
            <select
              onChange={(e) => {
                console.log('pickup driver id', e.target.value)
                setMultiSelectPickupDriver(e.target.value)
              }}
            >
              <option value={''}> select driver</option>
              {orderOptions.drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.firstName} {driver.lastName}
                </option>
              ))}
            </select>
          ) : (
            <></>
          )}
          <button
            onClick={() => {
              // set order id from selectedFlatRows and update with driver from the global driver multi select above
              // console.log('selected driver', multiSelectPickupDriver)
              mutationManyPickupDriver.mutate({
                orderIds: selectedFlatRows.map((row) => row.original.id),
                newPickUpDriverId: multiSelectPickupDriver,
              })
            }}
          >
            set pickup driver
          </button>
          {JSON.stringify(
            selectedFlatRows.map((row) => row.original.id),
            undefined,
            2
          )}

          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ' ↕'}</span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row)
                return (
                  <tr
                    // onClick={() =>
                    //   router.push({
                    //     pathname: `/Invoices/${row.original.id}`,
                    //     // query: { orderId: id },
                    //   })
                    // }
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
            {/* <tfoot>
          {footerGroups.map((footerGroup) => (
            <tr {...footerGroup.getFooterGroupProps()}>
              {footerGroup.headers.map((column) => (
                <td {...column.getFooterProps()}>{column.render('Footer')}</td>
              ))}
            </tr>
          ))}
        </tfoot> */}
          </table>
        </>
      ) : null}
    </>
  )
}

export default PickupListTable
