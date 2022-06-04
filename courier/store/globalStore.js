import create from 'zustand'
import { devtools } from 'zustand/middleware'

const store = (set) => ({
  // selector for current tcustomer form customer table, for orderm, customer info and invoice
  currentCustomer: {},
  setCurrentCustomer: (customer) =>
    set(() => ({ currentCustomer: customer }), false, 'setCurrentCustomer'),
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
})
export const useGlobalStore = create(devtools(store))
