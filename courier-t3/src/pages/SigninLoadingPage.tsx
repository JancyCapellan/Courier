import { useSession } from 'next-auth/react'
import React from 'react'

const SigninLoadingPage = () => {

  const { data: session, status: sessionStatus } = useSession()

  if (sessionStatus === "loading") {
    return (
      <div>LOADING SESSION</div>
    )
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div>Not Logged in Or finding login session failed</div>
    )
  }

  return (
    <div>SigninLoadingPage</div>
  )
}

export default SigninLoadingPage
