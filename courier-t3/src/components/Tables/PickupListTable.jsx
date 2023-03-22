import React, { useState } from 'react'
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
  useRowSelect,
  useFilters,
} from 'react-table'
// import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  dateBetweenFilterFn,
  DateRangeColumnFilter,
  DateTimeColumnFilter,
  Filter,
  GlobalFilter,
} from './tableFilters'
import { useRouter } from 'next/router'
import { trpc } from '@/utils/trpc'
import { useQueryClient } from 'react-query'
// import { makeOrder } from './makeData.mjs'

const IndeterminateCheckbox = React.forwardRef(function ICheckbox(
  { indeterminate, ...rest },
  ref
) {
  const defaultRef = React.useRef()
  const resolvedRef = ref || defaultRef

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input type="checkbox" ref={resolvedRef} {...rest} />
    </>
  )
})

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
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

// PICKUP LIST / INVOICE table
let defaultPageSize = 20
const PickupListTable = () => {
  const [multiSelectPickupDriver, setMultiSelectPickupDriver] =
    React.useState('')
  const [queryPageIndex, setQueryPageIndex] = React.useState(0)
  const [queryPageSize, setQueryPageSize] = React.useState(defaultPageSize)

  const [dateFilterValue, setDateFilterValue] = useState()

  const router = useRouter()

  const queryClient = useQueryClient()

  const {
    data: orderOptions,
    isSuccess: orderOptionsIsSuccess,
    isLoading: orderOptionIsLoading,
    error: orderOptionsError,
  } = trpc.useQuery(['invoice.getPickupDriversAndZones'], {
    // keepPreviousData: true,
    // staleTime: Infinity,
    refetchOnWindowFocus: 'always',
    refetchOnMount: 'always',
  })

  const {
    data: allOrders,
    isSuccess: allOrdersIsSuccess,
    isLoading: allOrdersIsLoading,
    refetch: refetchAllOrders,
    error,
  } = trpc.useQuery(
    [
      'invoice.getAllOrders',
      { queryPageIndex: queryPageIndex, queryPageSize: queryPageSize },
    ],
    {
      keepPreviousData: true,
      // staleTime: Infinity,
      refetchOnWindowFocus: true, // onyl works when data is stale
      refetchOnMount: 'always',
    }
  )

  // to use data have to make status check for each call, consolidating calls into one route will remvoe those multiple calls but i will have to make a new router and return a new shape for the entire page. currently trying to

  const changeOrderPickupDriver = trpc.useMutation(
    'invoice.changeOrderPickupDriver'
    // {
    // TODO: create optimistic updates to reduce refetches
    //   onSuccess: (data) => {
    //     // console.log('edit address', data)
    //     queryClient.setQueryData(
    //       ['invoice.getOrderById', { orderId: data.id }],
    //       (oldData) => {
    //         return [data.pickupDriver, ...oldData]
    //       }
    //     )
    //     // alert('user info edit completed')
    //   },
    // }
  )

  const mutationManyPickupDriver = trpc.useMutation(
    ['invoice.changeManyOrdersPickupDriver'],
    {
      onSuccess: () => {
        refetchAllOrders()
      },
    }
  )
  // const mutationPickupZone = useMutation(
  //   async ({ orderId, pickupZoneId }) => {
  //     // change pickup order for order after single selection

  //     const { data } = await backendClient.put(
  //       `order/update/${orderId}/pickupZone`,
  //       {
  //         pickupZoneId: pickupZoneId,
  //       }
  //     )
  //     return data
  //   },
  //   {
  //     onSuccess: (data) => {
  //       // queryClient.setQueryData(['getAllOrders', queryPageIndex, queryPageSize], (oldData) => {
  //       //   return [...oldData, data]
  //       // })
  //       console.log('updated pickupZone', data)
  //       // alert('user info edit completed')
  //     },
  //   }
  // )

  const invoicesColumns = React.useMemo(
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
                  console.log('pickupZoneId:', e.target.value)
                  // mutationPickupZone.mutate({
                  //   orderId: original.id,
                  //   pickupZoneId: e.target.value,
                  // })
                }}
              >
                <option value={original.pickupZoneId}>
                  {original.pickupZone?.Name}
                </option>
                {orderOptions.pickupZones.map((zone) => (
                  <option key={`${zone.code}${zone.id}`} value={zone.id}>
                    {zone.name}
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
                  // console.log('pickup driver id', e.target.value)
                  changeOrderPickupDriver.mutate({
                    orderId: original.id,
                    newPickUpDriverId: e.target.value,
                  })
                }}
              >
                <option value={original.pickupDriverId}>
                  {original.pickupDriver?.firstName}{' '}
                  {original.pickupDriver?.lastName}
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
        Header: 'customer',
        // accessor: 'customer.firstName' + 'customer.lastName',
        accessor: ({ customer }) =>
          `${customer?.firstName} ${customer?.lastName}`,
      },
      // {
      //   Header: 'Shipped To',
      //   accessor: (data) =>
      //     `${data.recieverFirstName} ${data.recieverLastName}`,
      // },
      {
        Header: 'Date/time Placed',
        accessor: 'timePlaced',
        filter: dateBetweenFilterFn,
      },
      // { Header: 'Total Items', accessor: 'totalItems' },
      // {
      //   Header: 'Total Price',
      //   accessor: 'totalPrice',
      // },
      {
        Header: 'Status',
        accessor: 'status.message',
      },
      {
        Header: 'Payment Type',
        accessor: 'paymentType',
      },
      {
        Header: 'Payment',
        accessor: 'paymentStatus',
      },
      {
        Header: 'Batch Container',
        accessor: 'containerId',
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
    [orderOptionsIsSuccess, allOrdersIsSuccess, orderOptions?.drivers]
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
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  // console.log(pickupListTable)

  const tableData = React.useMemo(() => {
    if (!allOrders) return []
    return allOrders.orders
  }, [allOrders])

  const tableTotalCount = allOrders?.orderCount

  // USETABLE HERE
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
    // footerGroups,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    setGlobalFilter,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    // visibleColumns,
    state,
    selectedFlatRows,
    preGlobalFilteredRows,
    setFilter,
  } = useTable(
    {
      columns: invoicesColumns,
      data: tableData,
      // filterTypes,
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true,
      pageCount: allOrdersIsSuccess
        ? Math.ceil(tableTotalCount / queryPageSize)
        : null,
      // autoResetSortBy: false,
      // autoResetExpanded: false,
      autoResetPage: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    // hook to add multiselect column checkboxes
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: 'Select',
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
    }
  )

  React.useEffect(() => {
    setQueryPageIndex(pageIndex)
  }, [pageIndex])

  React.useEffect(() => {
    setQueryPageSize(pageSize)
    gotoPage(0)
  }, [pageSize, gotoPage])

  if (error || !allOrdersIsSuccess) {
    return <p>Error</p>
  }

  if (allOrdersIsLoading) {
    return <p>Loading...</p>
  }

  //  add to filter by order branch location, date to date, orders shown by drivers
  return (
    <>
      <div className="tableFilters">
        <GlobalFilter
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
          preGlobalFilteredRows={preGlobalFilteredRows}
        />

        <DateTimeColumnFilter
          setFilter={setFilter}
          filterState={state.filters}
        />
      </div>

      {/* // TODO */}
      {/* multidriver select */}
      {!orderOptionsIsSuccess ? (
        <div className="">
          <label for="multiDriverSelect">Select Multiple Drivers: </label>
          <select
            id="multiDriverSelect"
            className="w-min"
            onChange={(e) => {
              // console.log('pickup driver id', e.target.value)
              // setMultiSelectPickupDriver(e.target.value)
              mutationManyPickupDriver.mutate({
                orderIds: selectedFlatRows.map((row) => row.original.id),
                newPickUpDriverId: e.target.value,
              })
            }}
          >
            <option value={null}> multi-driver select </option>
            {orderOptions.drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.firstName} {driver.lastName}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <></>
      )}

      <div className="pagination">
        {/* show per page */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[defaultPageSize, 5, 10, 40, 60, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              show per page: {pageSize}
            </option>
          ))}
        </select>
        {/* pagination buttons */}
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>
      </div>

      {/* table */}
      <table className="responsiveTable " {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <span>
                    {column.render('Header')}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ' ↕'}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)

            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    // <Td
                    //   {...cell.getCellProps()}
                    //   headers={invoiceHeaders}
                    //   render={cell.render('Cell')}
                    // />

                    <td
                      key={cell.column.Header}
                      className="pivoted"
                      {...cell.getCellProps()}
                    >
                      <div data-testid="td-before" className="tdBefore">
                        {cell.column.Header}
                      </div>
                      {/* {children ?? <div>&nbsp;</div>} */}
                      {cell.render('Cell')}
                    </td>

                    // <td
                    //   key={cell.column.Header}
                    //   data-header={cell.column.Header}
                    //   {...cell.getCellProps()}
                    // >
                    //   {cell.render('Cell')}
                    // </td>
                  )
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
  )
}

export default PickupListTable
