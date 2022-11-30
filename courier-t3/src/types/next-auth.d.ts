import { DefaultSession } from 'next-auth'
// import { JWT } from 'next-auth/jwt'

// declare module 'next-auth/jwt' {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     /** OpenID ID Token */
//     idToken?: string
//   }
// }

declare module 'next-auth' {
  enum userRoles {
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    CUSTOMER = 'CUSTOMER',
  }
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      // id: string
      role: 'ADMIN' | 'STAFF' | 'CUSTOMER'
    } & DefaultSession['user']
  }
}
