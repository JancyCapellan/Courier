import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type userRole = 'ADMIN' | 'STAFF' | 'CUSTOMER' | 'DRIVER'
interface appUser extends DefaultUser {
  role?: userRole
}
declare module 'next-auth/jwt' {
  interface JWT extends appUser {}
}

declare module 'next-auth' {
  interface User extends appUser {}
  interface Session extends DefaultSession {
    user?: User
  }
}

//helped in fixing typing error: https://reacthustle.com/blog/nextjs-setup-role-based-authentication, my mistake was not chagning the User type by extending it with my new type
