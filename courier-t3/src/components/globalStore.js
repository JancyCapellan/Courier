//@ts-nocheck
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useCart = create(
  devtools(
    persist(
      (set, get) => ({
        queryToRaise: {},
        currentCustomer: {},
        currentOrder: {
          cart: [],
          total_price: 0,
          total_items: 0,
          orderForm: {},
          payment: {
            type: '',
            extra: {},
          },
        },
        cartContent: [], // array of item.jsx objects,
        setQueryToRaiseState: (query) =>
          set((state) => {
            return {
              ...state,
              queryToRaise: query,
            }
          }),
        addFormToOrder: (form) =>
          set((state) => {
            return {
              ...state,
              currentOrder: {
                ...state.currentOrder,
                orderForm: form,
              },
            }
          }),
        addItemToCart: (item) =>
          set((state) => {
            return {
              ...state,
              currentOrder: {
                ...state.currentOrder,
                cart: [...state.cart, item],
              },
            }
          }),
        addTocart: (params) => {
          set((state) => ({
            totalqty: state.totalqty + 1,
            totalPrice: state.totalPrice + parseFloat(params.price),
            cartContent: [...state.cartContent, params],
          }))
        },
        updatecart: ({ params, mycart }) => {
          set((state) => ({
            totalqty: state.totalqty + 1,
            totalPrice: state.totalPrice + parseFloat(params.price),
            cartContent: mycart,
          }))
        },
        clearCart: () => set({ totalqty: 0, totalPrice: 0, cartContent: [] }),
        removeFromCart: (params) =>
          set((state) => ({
            totalPrice: state.totalPrice - params.price * params.quantity,
            totalqty: state.totalqty - params.quantity,
            cartContent: state.cartContent.filter(
              (item) => item.id !== params.id
            ),
          })),
        toggleAmount: (params) => {
          set((state) => ({}))
        },
        setCurrentCustomer: (customer) =>
          set(
            () => ({ currentCustomer: customer }),
            false,
            'setCurrentCustomer'
          ),
      }),
      // storage name
      {
        name: 'cart',
        serialize: (state) => JSON.stringify(state),
        // partialize: (state) =>
        //   Object.fromEntries(
        //     Object.entries(state).filter(([key]) => !['foo'].includes(key))
        //   ),
      }
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
