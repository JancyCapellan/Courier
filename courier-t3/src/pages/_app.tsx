// src/pages/_app.tsx
import { withTRPC } from '@trpc/next'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import type { AppRouter } from '../server/router'
import type {
  AppType,
  NextComponentType,
  NextPageContext,
} from 'next/dist/shared/lib/utils'
import superjson from 'superjson'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'
import { ReactQueryDevtools } from 'react-query/devtools'
import '@stripe/stripe-js' // https://github.com/stripe/stripe-js#ensuring-stripejs-is-available-everywhere
import getStripe from '@/utils/get-stripejs'
import { getLogger } from '../../logging/log-utils'
import Head from 'next/head'

// type NextPageWithLayout<P = {}> = NextPage<P> & {
//   getLayout?: (page: ReactNode) => ReactNode
// }
export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const stripePromise = getStripe()

//typing is better this time but according to: https://dev.to/ofilipowicz/next-js-per-page-layouts-and-typescript-lh5,
//there is more generics that can be used advance these types.
const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page)
  const layout = getLayout(<Component {...pageProps} />)

  // const logger = getLogger('app') // set to silent in ~/log-level.js

  // logger.error('a error message from _app')
  // logger.debug('a debug message from _app')
  // logger.info('a info message from _app')

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Courier Shipping</title>
        <meta
          name="description"
          content="webapp for shippers and courier services"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {layout}
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            // data is always fresh and never garabage collected after last observer is dismounted
            cacheTime: 1000 * 60 * 10,
            staleTime: 1000 * 60 * 5,
          },
        },
      },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp)
