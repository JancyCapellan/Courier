import create from 'zustand'
import { devtools } from 'zustand/middleware'

const customerTableStore = (set) => ({
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
  setQueryPageIndex: (pageIndex) =>
    set(() => ({ queryPageIndex: pageIndex }, false, 'setQueryPageIndex')),
  setQueryPageSize: (pageSize) =>
    set(() => ({ queryPageSize: pageSize }, false, 'setQueryPageSize')),
  setTotalCount: (totalCount) => set(() => ({ totalCount: totalCount }, false, 'setTotalCount')),
})
export const useCustomerTableStore = create(devtools(customerTableStore))
