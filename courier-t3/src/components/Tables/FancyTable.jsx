import React from 'react'

const FancyTable = ({
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
}) => {
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
  )
}

export default FancyTable
