//@ts-nocheck
import React from 'react'
import {
  useTable,
  usePagination,
  useBlockLayout,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from 'react-table'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import {
  useGlobalStore,
  usePersistedLocallyStore,
} from '@/components/globalStore'
import ModalContainer from '../../HOC/ModalContainer'
import RegistrationFormModal from '../../RegistrationFormModal'
import { trpc } from '@/utils/trpc'

export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
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

let defaultPageSize = 20
const Table = ({ columns }) => {
  const router = useRouter()
  const [queryPageIndex, setQueryPageIndex] = React.useState(0)
  const [queryPageSize, setQueryPageSize] = React.useState(defaultPageSize) // same as the first value in the select show option at the bottom of the parition div
  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const {
    data: customerListData,
    isLoading,
    isSuccess,
    error,
  } = trpc.useQuery(
    [
      'customers.getCustomerList',
      { queryPageIndex: queryPageIndex, queryPageSize: queryPageSize },
    ],
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  )

  const tableData = React.useMemo(() => {
    if (!customerListData) return []
    return customerListData.currentCustomerPage
  }, [customerListData])

  // const tableTotalCount = React.useMemo(() => customerListData?.customerTableCount, [])
  const tableTotalCount = customerListData?.customerTableCount

  const defaultColumn = React.useMemo(
    () => ({
      // Filter: DefaultColumnFilter,
      width: 215,
    }),
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
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // footerGroups,
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
      defaultColumn,
      filterTypes,
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
    usePagination,
    useBlockLayout
  )

  React.useEffect(() => {
    setQueryPageIndex(pageIndex)
  }, [pageIndex])

  React.useEffect(() => {
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
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
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

          <div className='btn btn-blue ' onClick={() => toggleModal()}>
            Create Customer
          </div>
          <ModalContainer show={showModal} handleClose={toggleModal}>
            <RegistrationFormModal
              isRegisteringStaff={false}
              closeModal={toggleModal}
              query={[
                'customers.getCustomerList',
                {
                  queryPageIndex: queryPageIndex,
                  queryPageSize: queryPageSize,
                },
              ]}
            />
          </ModalContainer>

          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            preGlobalFilteredRows={preGlobalFilteredRows}
          />
          {/* {console.log(globalFilter)} */}
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      <span>
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
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
      ) : null}
    </>
  )
}

const CustomerReactTable = () => {
  const router = useRouter()
  const setCurrentCustomer = usePersistedLocallyStore(
    (state) => state.setCurrentCustomer
  )
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'Full Name',
        accessor: (data) => `${data.firstName} ${data.lastName}`,
      },
      // {
      //   Header: 'First Name',
      //   accessor: 'firstName',
      // },
      // {
      //   Header: 'Last Name',
      //   accessor: 'lastName',
      // },
      {
        Header: 'utility',
        // oringal has all user data sent from api, row only has data shown to user
        Cell: ({ row: { original } }) => (
          <>
            <button
              className='btn btn-blue'
              onClick={() => {
                // console.log(original)
                // i could pass this like i did for the account page button but this hides the user id from the user, but then id is passed as a prop and not from the global state,
                // with global store if i can refresh without presistance, url is by design presisted
                // setCurrentCustomer(original) 
                router.push({
                  pathname: `/createOrder`,
                  query: { customerId: original.id },
                })
              }}
            >
              order
            </button>
            <button
              className='btn btn-blue ml-2'
              onClick={() => {
                setCurrentCustomer(original)
                router.push({
                  pathname: `/customers/${original.id}`,
                })
              }}
            >
              account page
            </button>
          </>
        ),
      },
    ],
    [router, setCurrentCustomer]
  )
  return (
    <div>
      <h1>Customer&apos;s Table</h1>
      <Table columns={columns} />
    </div>
  )
}

export default CustomerReactTable
