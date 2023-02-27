import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

// TODO: correctly type jwt for app needs
//  interface DefaultJWT extends Record<string, unknown> {
//     name?: string | null;
//     email?: string | null;
//     picture?: string | null;
//     sub?: string;
// }
// export interface JWT extends Record<string, unknown>, DefaultJWT {}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
    user?: {
      // id: string
      role: 'ADMIN' | 'STAFF' | 'CUSTOMER'
    }
  }
}

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
