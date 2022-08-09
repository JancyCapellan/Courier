import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from '../customHooks/useSession.js'
// import { useQueryClient } from 'react-query'

export const RouteGuard = ({ children }) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [session, loadingUserSession] = useSession()
  // const queryClient = useQueryClient()

  useEffect(() => {
    // on initial load - run auth check
    // console.log('session', session, !session, !!session)
    authCheck(router.asPath, session)

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false)
    router.events.on('routeChangeStart', hideContent)

    // on route change complete - run auth check
    router.events.on('routeChangeComplete', (url) => authCheck(url, session))

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', (url) => authCheck(url, session))
    }
  }, [])

  function authCheck(url, session) {
    const publicPaths = ['/register', '/']
    const path = url.split('?')[0]
    console.log('test:', path, !publicPaths.includes(path), !!session, session)

    if (!publicPaths.includes(path) && !!session) {
      setAuthorized(true)
      return
    }
    if (!publicPaths.includes(path) && !session) {
      setAuthorized(false)
      router.push({
        pathname: '/',
      })
    } else {
      setAuthorized(true)
    }
  }

  if (!authorized) {
    return (
      <>
        <p>loadings</p>
      </>
    )
  } else {
    return children
  }
}
