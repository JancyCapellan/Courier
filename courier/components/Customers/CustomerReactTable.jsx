/* eslint-disable react/jsx-key */
import React, { useMemo, useState } from 'react'
import { usePagination, useTable } from 'react-table'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { useCustomerTableStore } from '../../store/customerTableStore'

const useGetCustomerList = () => {
  const getCustomerList = async () => {
    const { data } = await axios.get(`http://localhost:3000/customer/AllCustomers`)
    return data
  }
  const { data: customerList, status: getCustomerListStatus } = useQuery(
    'getCustomerList',
    getCustomerList
  )

  const tableData = useMemo(() => {
    if (!customerList) return []
    return customerList
  }, [customerList])
  return [tableData, getCustomerListStatus]
}

const COLUMNS = [
  {
    Header: 'ID',
    accessor: 'id', // accessor is the "key" in the data
  },
  {
    Header: 'Name',
    accessor: (data) => `${data.firstName} ${data.lastName}`,
  },
]
const Table = () => {
  const columns = useMemo(() => COLUMNS, [])
  const [tableData, isLoading] = useGetCustomerList()
  const queryPageIndex = useCustomerTableStore((state) => state.queryPageIndex)
  const queryPageSize = useCustomerTableStore((state) => state.queryPageSize)
  const totalCount = useCustomerTableStore((state) => state.totalCount)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: isLoading === 'success' ? tableData : [],
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: isLoading === 'success' ? Math.ceil(totalCount / queryPageSize) : null,
    },
    usePagination
  )

  //! TODO: change to zustand logic then pagination should be close to working,adding filters to sort the customers and i should the be able to move on to admin's staff table and invoices order table
  // React.useEffect(() => {
  //   dispatch({ type: PAGE_CHANGED, payload: pageIndex })
  // }, [pageIndex])

  // React.useEffect(() => {
  //   dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize })
  //   gotoPage(0)
  // }, [pageSize, gotoPage])

  // React.useEffect(() => {
  //   if (tableData?.count) {
  //     dispatch({
  //       type: TOTAL_COUNT_CHANGED,
  //       payload: tableData.count,
  //     })
  //   }
  // }, [tableData?.count])

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
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
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className='pagination'>
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
            type='number'
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

const CustomerReactTable = () => {
  return (
    <div>
      <h1>Customer&apos;s Table</h1>
      <Table />
    </div>
  )
}

export default CustomerReactTable
