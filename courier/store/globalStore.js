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

//  example customer, must update to typing
// id: 'ckx50tt3s0000e0uync9ykryh'
// name: null
// emailVerified: null
// image: null
// firstName: 'Jancy'
// lastName: 'Capellan'
// middleName: ''
// password: '123'
// email: 'jancycapellan97@gmail.com'
// role: 'ADMIN'
// company: null
// branchName: null
// lastSaleDate: null
// lastLogin: null
// preferredLanguage: 'English'
// licenseId: null
