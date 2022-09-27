//@ts-nocheck

import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useGlobalStore = create(
  devtools(
    // persist(
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
          const itemIndexInCart = state.currentOrder.cart.findIndex(
            (cartItem) => cartItem.id === item.id
          )
          if (itemIndexInCart < 0) {
            return {
              ...state,
              currentOrder: {
                ...state.currentOrder,
                // total_price: state.item_price + item.price,
                cart: [...state.currentOrder.cart, item],
              },
            }
          } else {
            state.currentOrder.cart[itemIndexInCart].amount += item.amount
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
        set(() => ({ currentCustomer: customer }), false, 'setCurrentCustomer'),
    })
  )
)

export const usePersistedLocallyStore = create(
  devtools(
    persist(
      (set) => ({
        cartStore: {
          cart: [],
          total_price: 0,
          total_items: 0,
          orderForm: {},
          payment: {
            type: '',
            extra: {},
          },
        },
        addItemToCart: (item) =>
          set((state) => {
            const itemIndexInCart = state.currentOrder.cart.findIndex(
              (cartItem) => cartItem.id === item.id
            )
            if (itemIndexInCart < 0) {
              return {
                ...state,
                currentOrder: {
                  ...state.currentOrder,
                  // total_price: state.item_price + item.price,
                  cart: [...state.currentOrder.cart, item],
                },
              }
            } else {
              state.currentOrder.cart[itemIndexInCart].amount += item.amount
            }
          }),
      }),
      { name: 'persistedStore' }
    )
  )
)
