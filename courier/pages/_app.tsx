import '../styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

import { AuthProvider } from '../contexts/authContext'
import { CartProvider } from '../contexts/cartContext'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Sidebar from '../components/Sidebar'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 60 * 60 * 1000,
      },
    },
  })

  // const EmptyLayout = ({ children }) => <>{children}</>
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    // <AuthProvider>
    // <SessionProvider session={pageProps.session}>
    <QueryClientProvider client={queryClient}>
      <CartProvider>{getLayout(<Component {...pageProps} />)}</CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

    // </SessionProvider>
    // </AuthProvider>
  )
}

// export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
//   // Use the layout defined at the page level, if available
//   const getLayout = Component.getLayout ?? ((page) => page)

//   return getLayout(<Component {...pageProps} />)
// }

export default MyApp
