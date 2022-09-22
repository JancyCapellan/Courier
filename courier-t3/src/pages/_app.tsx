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

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// this is originally AppType but that doesnt work with getLayout, not enough TS knowledge to fix it
const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout =
    Component.getLayout ?? ((component: AppPropsWithLayout) => component)
  const layout = getLayout(<Component {...pageProps} />)

  return (
    <SessionProvider session={session}>
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
