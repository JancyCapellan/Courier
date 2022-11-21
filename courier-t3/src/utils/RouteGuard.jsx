import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

// import { userService } from 'services'

function RouteGuard({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  const { data: session, status: sessionStatus } = useSession()

  useEffect(
    () => {
      // on initial load - run auth check
      if (sessionStatus !== 'loading') {
        authCheck(router.asPath)

        router.events.on('routeChangeComplete', authCheck)
      }

      // NOTE: flashes aunthoirzed pagae skeleton before redirecting
      // on route change start - hide page content by setting authorized to false - NOTE: causes content flashing because of the small time needed to hide and check and reveal if authorized
      // const hideContent = () => setAuthorized(() => false)
      // router.events.on('routeChangeStart', hideContent)

      // on route change complete - run auth check

      // unsubscribe from events in useEffect return function
      return () => {
        // router.events.off('routeChangeStart', hideContent)
        router.events.off('routeChangeComplete', authCheck)
      }
    },
    // added session here because session has to be fetched with the hook, so the routegaurd will need to rerender or it will cause an error where you are redirected before the login session is cached thus leading to an incorrect NOT AUTHORIZED error
    [session]
  )

  // TODO: make the check break up access by user roles/access control
  // Thoughts: routes are protected by the roles they were made for "admin" or "customer", users must be signed in to go to most pages, the pages that users are allowed, they must follow: is the page a public path? is user logged in? is user role allowed on page?
  // siebarTypes exported from sidebar data
  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/login', '/', '/register']
    const path = url.split('?')[0]

    if (publicPaths.includes(path)) {
      setAuthorized(true)
      return authorized && children
    }

    if (
      sessionStatus !== 'authenticated' &&
      !session?.user.id &&
      !publicPaths.includes(path)
    ) {
      console.log('NOT AUTHORIZED')
      setAuthorized(false)
      router.push({
        pathname: '/',
        query: { access: 'unauthorized' },
      })
    } else {
      setAuthorized(true)
    }
  }

  return authorized && children
}

export default RouteGuard
