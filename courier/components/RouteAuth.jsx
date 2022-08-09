import React from 'react'
import { useSession } from '../customHooks/useSession'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'
import { getSession } from 'next-auth/react'

const RouteAuth = ({ children }) => {
  const [session, loadingSession] = useSession()

  const queryClient = useQueryClient()

  const router = useRouter()

  const isUser = !!session?.user
  console.log('isUser', isUser)

  const publicPaths = ['/register', '/']
  const childPath = router.asPath.split('?')[0]

  React.useEffect(() => {
    if (loadingSession) return
    if (!isUser && !publicPaths.includes(childPath))
      router.push({
        pathname: '/',
      })
  }, [isUser, loadingSession])

  if (publicPaths.includes(childPath)) {
    // console.log('public page')
    return children
  }

  // if( childPath === '/' )
  //    queryClient.fetchQuery(['session'], () => fetchSession())

  // const user = queryClient.getQueryData(['session'])
  // console.log('user', user)
  if (!loadingSession && isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.

  return <div>Loading...</div>
}

export default RouteAuth
