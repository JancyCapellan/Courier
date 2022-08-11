import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useCart = create(
  devtools(
    persist(
      (set, get) => ({
        currentCustomer: {},
        total: 0,
        totalqty: 0,
        cartContent: [],
        addTocart: (params) => {
          set((state) => ({
            totalqty: state.totalqty + 1,
            total: state.total + parseFloat(params.price),
            cartContent: [...state.cartContent, params],
          }))
        },
        updatecart: ({ params, mycart }) => {
          set((state) => ({
            totalqty: state.totalqty + 1,
            total: state.total + parseFloat(params.price),
            cartContent: mycart,
          }))
        },
        clearCart: () => set({ totalqty: 0, total: 0, cartContent: [] }),
        removeFromCart: (params) =>
          set((state) => ({
            total: state.total - params.price * params.quantity,
            totalqty: state.totalqty - params.quantity,
            cartContent: state.cartContent.filter((item) => item.id !== params.id),
          })),
        setCurrentCustomer: (customer) =>
          set(() => ({ currentCustomer: customer }), false, 'setCurrentCustomer'),
      }),
      { name: 'cart', serialize: (state) => JSON.stringify(state) }
    )
  )
)

// const store = (set) => ({
//   // selector for current tcustomer form customer table, for orderm, customer info and invoice
//   currentCustomer: {},
//   setCurrentCustomer: (customer) =>
//     set(() => ({ currentCustomer: customer }), false, 'setCurrentCustomer'),
//   // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   // removeAllBears: () => set({ bears: 0 }),
// })

export const useGlobalStore = useCart

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
