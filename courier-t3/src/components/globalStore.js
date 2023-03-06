//@ts-nocheck
import { useState, useEffect } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useGlobalStore = create(
  devtools(
    // persist(
    (set, get) => ({
      queryToRaise: {},
      refetchCart: {},
      refetchCartAddresses: {},
      currentCustomer: {},
      setQueryToRaiseState: (query) =>
        set((state) => {
          return {
            ...state,
            queryToRaise: query,
          }
        }),
      setRefetchCart: (refetchFn) =>
        set((state) => {
          return {
            ...state,
            refetchCart: refetchFn,
          }
        }),
      setRefetchCartAddresses: (refetchFn) =>
        set((state) => {
          return {
            ...state,
            refetchCartAddresses: refetchFn,
          }
        }),
      setCurrentlySelectedCreateOrderCustomerId: (customerId) =>
        set((state) => {
          return {
            ...state,
            currentCustomer: customerId,
          }
        }),
    })
  )
)

export const usePersistedLocallyStore = create(
  devtools(
    // persist(
    (set, get) => ({
      currentCustomer: {},
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
      // hasHydrated: false,
      // setHasHydrated: (bool) => {
      //   set({
      //     hasHydrated: bool,
      //   })
      // },
      clearLocalStorage: () =>
        set(
          () => {
            return {
              currentCustomer: {},
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
            }
          },
          false,
          'clearLocalStorage'
        ),

      setCurrentCustomer: (customer) =>
        set(() => ({ currentCustomer: customer }), false, 'setCurrentCustomer'),
      addFormToOrder: (currentOrderForm) =>
        set((state) => {
          return {
            ...state,
            cartStore: {
              ...state.cartStore,
              orderForm: currentOrderForm,
            },
          }
        }),
      addItemToCart: (item) =>
        set(
          (state) => {
            const updatedCart = [...state.cartStore.cart]
            const itemIndexInCart = updatedCart.findIndex(
              (cartItem) => cartItem.productsId === item.productsId
            )
            // if cart has item, update total price and total
            if (itemIndexInCart < 0) {
              return {
                ...state,
                cartStore: {
                  ...state.cartStore,
                  total_price:
                    state.cartStore.total_price +
                    parseInt(item.price * item.amount),
                  total_items: state.cartStore.total_items + item.amount,
                  cart: [...state.cartStore.cart, item],
                },
              }
            } else {
              // const itemInCartToUpdate = state.cartStore.cart[itemIndexInCart]
              // itemInCartToUpdate.amount = itemInCartToUpdate + item.amount,

              const updatedItem = { ...updatedCart[itemIndexInCart] }
              updatedItem.amount += parseInt(item.amount)
              updatedCart[itemIndexInCart] = updatedItem
              return {
                ...state,
                cartStore: {
                  ...state.cartStore,
                  total_items: state.cartStore.total_items + item.amount,
                  total_price:
                    state.cartStore.total_price + item.price * item.amount,
                  // merge the cart array with the current item with the new additional item, item{name, id, price and amount} + item{amou]nt}
                  cart: updatedCart,
                },
              }
            }
          },
          false,
          'addItemToCart'
        ),
      clearCart: () =>
        set(
          (state) => {
            return {
              ...state,
              cartStore: {
                ...state?.cartStore,
                cart: [],
                total_price: 0,
                total_items: 0,
              },
            }
          },
          false,
          'clearCart'
        ),
      toggleAmount: (itemId, toggle) => {
        set((state) => ({}))
      },
      removeFromCart: (itemId) => {
        set(
          (state) => {
            return {
              ...state,
              cartStore: {
                ...state.cartStore,
                cart: state.cartStore.cart.filter(
                  (item) => item.productsId !== itemId
                ),
              },
            }
          },
          false,
          'removeFromCart'
        )
      },
    })
    // {
    //   name: 'persistedStore',
    //   // serialize: (state) => btoa(JSON.stringify(state)),
    //   // deserialize: (storedState) => JSON.parse(atob(storedState)),
    //   // onRehydrateStorage: () => (state) => {
    //   //   state.setHasHydrated(true)
    //   // },
    //   onRehydrateStorage: () => {
    //     console.log('hydration starts')
    //
    //     // optional
    //     return (state, error) => {
    //       if (error) {
    //         console.log('an error happened during hydration', error)
    //       } else {
    //         console.log('hydration finished')
    //         state.setHasHydrated(true)
    //       }
    //     }
    //   },
    // }
    // )
  )
)

// FOR HYDRATION IN REACT, for persisted store use
// const isHydrated = usePersistedLocallyStore((state) => state.isHydrated)
// if (!hasHydrated) {
//     return <p>Loading...</p>
//   }
//
//   return (
//     // ...
//   );

// export const useCheckHydration = () => {
//   const [hydrated, setHydrated] = useState(
//     usePersistedLocallyStore.persist.hasHydrated
//   )
//
//   useEffect(() => {
//     const unsubHydrate = usePersistedLocallyStore.persist.onHydrate(() =>
//       setHydrated(false)
//     ) // Note: this is just in case you want to take into account manual rehydrations. You can remove this if you don't need it/don't want it.
//     // const unsubFinishHydration =
//     //   usePersistedLocallyStore.persist.onFinishHydration(() =>
//     //     setHydrated(true)
//     //   )
//
//     setHydrated(usePersistedLocallyStore.persist.hasHydrated())
//
//     return () => {
//       unsubHydrate()
//       // unsubFinishHydration()
//     }
//   }, [])
//
//   return hydrated
// }
