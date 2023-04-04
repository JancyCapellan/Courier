import { withAuth } from 'next-auth/middleware'
import { useRouter } from 'next/router'
import { NextResponse } from 'next/server'

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  // only runs if the authroized callback is true
  function middleware(req) {
    console.log('MIDDLEWARE NEXTAUTH RAN:', req.nextauth.token)
  },
  {
    callbacks: {
      // todo: MAKE MORE ROBOUST
      authorized({ req, token }) {
        // `/admin` requires admin role
        // console.log({ token })

        // const router = useRouter()
        // if (token === null) {
        //   // router.push('/')
        //   console.log('TOKEN IS NULL')
        //   NextResponse.redirect(process.env?.NEXTAUTH_URL!)
        //   return false
        // }

        if (!token?.role) return false
        if (req.nextUrl.pathname === '/administration') {
          //console.log('auth token:', token?.role, !token) //?  is token missing role becuase of its typing?
          return token?.role === 'ADMIN'
        } else return false // this way i can do more than just rely on the matcher to match the url.
      },
    },
  }
)

export const config = { matcher: ['/administration'] }
