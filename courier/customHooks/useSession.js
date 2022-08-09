// credit to https://github.com/nextauthjs/react-query
// ! makes next-auth sessions to be managed by react-query sessions

import { useQuery } from 'react-query'
import { useRouter } from 'next/router'

export async function fetchSession() {
  const res = await fetch('/api/auth/session')
  const session = await res.json()
  if (Object.keys(session).length) {
    return session
  }
  return null
}

export function useSession({
  required,
  redirectTo = '/api/auth/signin?error=SessionExpired',
  queryConfig = {
    // staleTime: 60 * 1000 * 60 * 3, // 3 hours
    // refetchInterval: 60 * 1000 * 5, // 5 minutes
    cacheTime: Infinity,
    staleTime: Infinity,
  },
} = {}) {
  const router = useRouter()
  const query = useQuery('session', fetchSession, {
    ...queryConfig,
    onSettled(data, error) {
      if (queryConfig.onSettled) queryConfig.onSettled(data, error)
      if (data || !required) return
      router.push(redirectTo)
    },
  })
  return [query.data, query.status === 'loading']
}
