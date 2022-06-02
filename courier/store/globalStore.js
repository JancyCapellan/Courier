import create from 'zustand'

export const useGlobalStore = create((set) => ({
  // selector for current tcustomer form customer table, for orderm, customer info and invoice
  currentCustomer: '',
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
