import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { fetchSession, useSession } from '../customHooks/useSession.js'
import { useQueryClient } from 'react-query'
import { getSession } from 'next-auth/react'

export const RouteGuard = ({ children }) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // on initial load - run auth check
    // console.log('session', session, !session, !!session)
    authCheck(router.asPath)

    // on route change start - hide page content by setting authorized to false
    // const hideContent = () => setAuthorized(false)
    // router.events.on('routeChangeStart', hideContent)

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', (url) => authCheck(url))

    // unsubscribe from events in useEffect return function
    // return () => {
    //   // router.events.off('routeChangeStart', hideContent)
    //   router.events.off('routeChangeComplete', (url) => authCheck(url))
    // }
  }, [])

  async function authCheck(url) {
    const publicPaths = ['/register', '/']
    const path = url.split('?')[0]

    if (publicPaths.includes(path)) {
      // console.log('public page')
      setAuthorized(true)
      return
    }

    // const user = await queryClient.fetchQuery(['session'], () => fetchSession())
    // const user = queryClient.getQueryData(['session'])
    const user = await getSession()

    // console.log('user', user, !!user)

    // console.log('public path?', publicPaths.includes(path))
    if (!publicPaths.includes(path)) {
      if (!!user) {
        // console.log('not public, !!session', !!user)
        setAuthorized(true)
        return
      }
      if (!!!user) {
        // console.log('not public !!!session)', !!!user)
        setAuthorized(false)
        router.push({
          pathname: '/',
        })
        return
      }
    }
  }

  if (!authorized) {
    return (
      <>
        <h1>Not Authorized / Checking Authorization</h1>
      </>
    )
  } else {
    return children
  }
}
