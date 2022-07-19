import { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import {
  useTable,
  usePagination,
  useBlockLayout,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from 'react-table'

import { GlobalFilter } from '../../Customers/CustomerReactTable.jsx'

let defaultPageSize = 20

const StaffTable = () => {
  const [queryPageIndex, setQueryPageIndex] = useState(0)
  const [queryPageSize, setQueryPageSize] = useState(defaultPageSize)
  const router = useRouter()

  const getAllStaff = async (page, pageSize) => {
    const offset = page * pageSize
    try {
      const { data } = await axios.get(
        `http://localhost:3000/user/users/getAllStaff?offset=${offset}&limit=${pageSize}`
      )
      // console.log('DRIVERS DATA', data)
      return data
    } catch (e) {
      throw new Error(`API error:${e?.message}`)
    }
  }
  const {
    data: staff,
    status,
    isLoading,
    isSuccess,
    error,
  } = useQuery(
    ['getAllStaff', queryPageIndex, queryPageSize],
    () => getAllStaff(queryPageIndex, queryPageSize),
    {
      onSuccess: (data) => {},
      onError: (error) => {
        console.log('error fetching product types', error)
      },
    }
  )

  const columns = useMemo(
    () => [
      {
        Header: 'Driver Name',
        accessor: (data) => `${data.firstName} ${data.lastName}`,
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Affliated Branch',
        accessor: 'branchName',
      },
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'utility',
        Cell: ({ row: { original } }) => (
          <>
            <button
              onClick={() => {
                router.push({
                  pathname: `/administration/${original.id}`,
                })
              }}
            >
              Staff Page
            </button>
          </>
        ),
      },
    ],
    []
  )

  const tableData = useMemo(() => {
    if (!staff) return []
    return staff.drivers
  }, [staff])

  const tableTotalCount = staff?.driversTableCount
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
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
    preGlobalFilteredRows,
  } = useTable(
    {
      columns,
      data: tableData,
      // defaultColumn,
      // filterTypes,
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true,
      pageCount: isSuccess ? Math.ceil(tableTotalCount / queryPageSize) : null,
      // autoResetSortBy: false,
      // autoResetExpanded: false,
      autoResetPage: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  useEffect(() => {
    setQueryPageIndex(pageIndex)
  }, [pageIndex])

  useEffect(() => {
    setQueryPageSize(pageSize)
    gotoPage(0)
  }, [pageSize, gotoPage])

  if (error) {
    return <p>Error</p>
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {status === 'loading' && <div>loading</div>}
      {status === 'success' && (
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
              {[defaultPageSize, 5, 10, 30, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>

          <GlobalFilter
            globalFilter={globalFilter}
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
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ' ↕'}
                      </span>
                    </th>
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
          </table>
        </>
      )}
    </>
  )
}

export default StaffTable
