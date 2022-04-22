import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/authContext'
import { CartProvider } from '../contexts/cartContext'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider, QueryClient } from 'react-query'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const queryClient = new QueryClient()
  return (
    // <AuthProvider>
    // <SessionProvider session={pageProps.session}>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </QueryClientProvider>

    // </SessionProvider>
    // </AuthProvider>
  )
}
export default MyApp
