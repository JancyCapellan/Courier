import '../styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import { CartProvider } from '../contexts/cartContext'
// import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RouteGuard } from '../components/RouteGuard'
import RouteAuth from '../components/RouteAuth'

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
        // data is always fresh and never garabage collected after last observer is dismounted
        cacheTime: Infinity,
        staleTime: Infinity,
      },
    },
  })

  // const EmptyLayout = ({ children }) => <>{children}</>
  const getLayout = Component.getLayout ?? ((component) => component)

  return (
    // <AuthProvider>
    // <SessionProvider session={pageProps.session}>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <RouteGuard>{getLayout(<Component {...pageProps} />)}</RouteGuard>
      </CartProvider>

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
