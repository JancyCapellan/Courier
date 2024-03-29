import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const nextAuthOptions = (req, res) => {
  return {
    // adapter: PrismaAdapter(prisma), breaks functionality with credentials provider
    providers: [
      CredentialsProvider({
        id: 'login',
        name: 'login',
        credentials: {
          // domain: {
          //   label: 'Domain',
          //   type: 'text ',
          //   placeholder: 'CORPNET',
          //   value: 'CORPNET',
          // },
          email: { label: 'Email', type: 'text', placeholder: 'Name' },
          password: { label: 'Password', type: 'password' },
        },
        authorize: async (credentials) => {
          // database look up

          //can make part of the api
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
              password: credentials.password,
            },
            // select: {
            //   id: true,
            //   preferredLanguage: true,
            // },
          })

          if (user !== null) {
            // console.log('auth user', user)
            // userAccount = user
            return {
              // used by JWT callback
              user: {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
              },
            }
          } else {
            console.log('nextauth signin error')
            return null
          }
        },
      }),
    ],

    // adapter: PrismaAdapter(prisma), NOT NEEDED BECAUSE CREDENTIALS DOES NOT PRESIST IN DATABASE
    session: {
      // strategy: 'database',
      jwt: true,
      maxAge: 7 * 24 * 60 * 60,
    },
    pages: {
      signIn: '/',
    },
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
      encryption: true,
    },
    callbacks: {
      // login: (user, account, profile) => {
      //   console.log('login callback here')
      //   return Promise.resolve(true)
      // },
      // signIn: async ({ user, account, profile }) => {
      //   console.log('SIGNED IN', user)
      //   const isAllowedToSignIn = true
      //   if (isAllowedToSignIn) {
      //     // return '/account'
      //     return true
      //   } else {
      //     // Return false to display a default error message
      //     return false
      //     // Or you can return a URL to redirect to:
      //     // return '/unauthorized'
      //   }
      // },
      // login: ({ user, account, profile, email, credentials }) => {
      //   console.log('here', credentials)
      //   return { name: 'test' }
      // },
      jwt: async ({ token, user }) => {
        // first time jwt callback is run, user object is available
        if (user) {
          token.user = user.user
          token.id = user.user.id
          // console.log('JWT', token)
          return token
        }

        return token
      },
      session: async ({ session, token }) => {
        // console.log('SESSION', session)
        // let test = { ...session.user, ...token.user }
        if (token) {
          session.id = token.user.id
          session.user = token.user
            ? token.user
            : { ...token.user, ...session.user }
          // session.user = test
        }
        // console.log('nextauth-session', session)

        return session
      },
    },
  }
}

const authHandler = (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res))
}
export default authHandler
