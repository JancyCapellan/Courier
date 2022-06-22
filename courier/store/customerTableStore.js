import create from 'zustand'
import { devtools } from 'zustand/middleware'

const customerTableStore = (set) => ({
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
})
export const useCustomerTableStore = create(devtools(customerTableStore))
