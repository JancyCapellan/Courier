/* eslint-disable react/jsx-key */
import React, { useEffect } from 'react'
import { usePagination, useTable } from 'react-table'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useCustomerTableStore } from '../../store/customerTableStore'

const useGetCustomerList = (page, pageSize) => {
  // const queryPageIndex = useCustomerTableStore((state) => state.queryPageIndex)
  // const queryPageSize = useCustomerTableStore((state) => state.queryPageSize)
  // page is queryPageIndex the current page
  // pageSize is queryPageSize
  // offest is the page times pageSize to get the total records to count next for the nest rows/page of content
  const offset = page * pageSize

  const getCustomerList = async () => {
    const { data } = await axios.get(
      `http://localhost:3000/customer/AllCustomers?offset=${offset}&limit=${pageSize}`
    )
    return data
  }
  const {
    data: customerListData,
    isLoading,
    isSuccess,
    error,
  } = useQuery(
    ['getCustomerList', queryPageIndex, queryPageSize],
    () => getCustomerList(queryPageIndex, queryPageSize),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  )
  const customerList = customerListData?.currentCustomerPage
  const tableData = React.useMemo(() => {
    if (!customerList) return []
    return customerList
  }, [customerList])
  return [tableData, isLoading, isSuccess, error, customerListData?.customerTableCount]
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

const getCustomerList = async (page, pageSize) => {
  const offset = page * pageSize
  try {
    const { data } = await axios.get(
      `http://localhost:3000/customer/AllCustomers?offset=${offset}&limit=${pageSize}`
    )
    return data
  } catch (e) {
    throw new Error(`API error:${e?.message}`)
  }
}
const Table = () => {
  const columns = React.useMemo(() => COLUMNS, [])
  const [queryPageIndex, setQueryPageIndex] = React.useState(0)
  const [queryPageSize, setQueryPageSize] = React.useState(10)

  // const queryPageIndex = useCustomerTableStore((state) => state.queryPageIndex)
  // const queryPageSize = useCustomerTableStore((state) => state.queryPageSize)
  // const setQueryPageIndex = useCustomerTableStore((state) => state.setQueryPageIndex)
  // const setQueryPageSize = useCustomerTableStore((state) => state.setQueryPageSize)
  // const [tableData, isLoading, isSuccess, error, tableTotalCount] = useGetCustomerList(
  //   queryPageIndex,
  //   queryPageSize
  // )

  const {
    data: customerListData,
    isLoading,
    isSuccess,
    error,
  } = useQuery(
    ['getCustomerList', queryPageIndex, queryPageSize],
    () => getCustomerList(queryPageIndex, queryPageSize),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  )
  const customerList = customerListData?.currentCustomerPage
  const tableData = React.useMemo(() => {
    if (!customerList) return []
    return customerList
  }, [customerList])

  const tableTotalCount = customerListData?.customerTableCount

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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: isSuccess ? tableData : [],
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: isSuccess ? Math.ceil(tableTotalCount / queryPageSize) : null,
    },
    usePagination
  )

  React.useEffect(() => {
    setQueryPageIndex(pageIndex)
  }, [pageIndex])

  React.useEffect(() => {
    // dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize })
    setQueryPageSize(pageSize)
    gotoPage(0)
  }, [pageSize, gotoPage])

  //total count of items in database side of the table
  // React.useEffect(() => {
  //   if (tableTotalCount) {
  //     setTotalCount(tableTotalCount)
  //   }
  // }, [tableTotalCount])

  if (error) {
    return <p>Error</p>
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {isSuccess ? (
        <>
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
              {[5, 10, 15, 20, 30].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
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
        </>
      ) : null}
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
