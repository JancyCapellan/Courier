import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log('NEXTUATH middleware token:', req.nextauth.token)
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // `/admin` requires admin role
        if (req.nextUrl.pathname === "/administration") {
          return token?.role === "admin"
        }
        // `/me` only requires the user to be logged in
        return !!token
      },
    },

  }
)

export const config = { matcher: ["/administration"] }
