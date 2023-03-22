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

// const stripePromise = getStripe()

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
        <meta name="application-name" content="Courier Shipping" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PWA App" />
        <meta name="description" content="couries/shippers management app" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        {/* <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        /> */}
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        /> */}

        {/* <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://" />
        <meta name="twitter:title" content="Courier Shipping" />
        <meta name="twitter:description" content=" " />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PWA App" />
        <meta property="og:description" content="Best PWA App in the world" />
        <meta property="og:site_name" content="PWA App" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/icons/apple-touch-icon.png"
        /> */}

        {/* <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_2048.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1668.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1536.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1125.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_1242.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_750.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple_splash_640.png"
          sizes="640x1136"
        /> */}
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
            cacheTime: 1000 * 60 * 10,
            staleTime: 1000 * 60,
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
