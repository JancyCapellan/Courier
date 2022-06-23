/* eslint-disable react/jsx-key */
import React from 'react'
import { useTable, usePagination, useSortBy, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { useQuery } from 'react-query'
import axios from 'axios'
import { GlobalFilter } from './tableFilters'
import { useRouter } from 'next/router'

const getAllOrders = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/order/allOrders')
    return data
  } catch (error) {
    throw new Error(`API error:${error?.message}`)
  }
}

const PickupListTable = () => {
  const router = useRouter()
  const columns = React.useMemo(
    () => [
      {
        Header: 'OrderId',
        accessor: 'id',
      },
      // {
      //   Header: 'Customer ID',
      //   accessor: 'userId',
      // },
      // {
      //   Header: 'Customer',
      //   accessor: (data) => `${data.user.firstName} ${data.user.lastName}`,
      // },
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
        accessor: 'status',
      },
      { Header: 'Location', accessor: 'location' },
      {
        Header: 'Driver',
        accessor: (data) => {
          if (data.pickupdriver === null) return 'NONE'
          return `${data.pickupdriver?.firstName} ${data.pickupdriver?.lastName}`
        },
      },
    ],
    []
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

  const {
    data: pickupListTable,
    isSuccess,
    isLoading,
    error,
  } = useQuery('getAllOrders', () => getAllOrders(), {
    keepPreviousData: true,
    staleTime: Infinity,
  })

  const tableData = React.useMemo(() => {
    if (!pickupListTable) return []
    return pickupListTable
  }, [pickupListTable])

  console.log(pickupListTable)
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
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data: tableData,
      // filterTypes,
    },
    useGlobalFilter,
    useSortBy
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
