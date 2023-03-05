import { withAuth } from 'next-auth/middleware'

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  // only runs if the authroized callback is true
  function middleware(req) {
    console.log('MIDDLEWARE NEXTAUTH RAN:', req.nextauth.token)
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // `/admin` requires admin role
        if (req.nextUrl.pathname === '/administration') {
          //console.log('auth token:', token?.role, !token) //?  is token missing role becuase of its typing?
          return token?.role === 'ADMIN'
        } else return false // this way i can do more than just rely on the matcher to match the url.
      },
    },
  }
)

export const config = { matcher: ['/administration'] }
