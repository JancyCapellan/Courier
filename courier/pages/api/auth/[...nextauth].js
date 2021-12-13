import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()
const nextAuthOptions = (req, res) => {
  return {
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
          // if (credentials.email === 'john@email.com' && credentials.password === '123') {
          //   return {
          //     id: 2,
          //     name: 'John',
          //     email: 'johndoe@test.com',
          //   }
          // }
          const loginForm = {
            email: credentials.email,
            password: credentials.password,
          }

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
            return null
          }

          // try {
          //   const res = await axios.post('http://localhost:3000/user/login', loginForm)
          //   const user = res.data
          //   console.log('res from login', res.data)

          //   if (res.status === 200) return { email: credentials.email }

          //   // return null
          // } catch {
          //   return null
          // }
          // await axios
          //   .post('http://localhost:3000/user/login', loginForm)
          //   .then((res) => {
          //     const user = res.data
          //     alert('here', user)
          //     console.log(' auth user', user)
          //     response = res
          //     return user
          //   })
          //   .catch((error) => {
          //     if (error.response) {
          //       console.log(error.response.status)
          //       response = error.response
          //     } else if (error.request) {
          //       console.log(error.request)
          //     } else {
          //       // Something happened in setting up the request that triggered an Error
          //       console.log('Error', error.message)
          //     }
          //     console.log(error.config)
          //     return null
          //   })
        },
      }),
    ],

    // adapter: PrismaAdapter(prisma), NOT NEEDED BECAUSE CREDENTIALS DOES NOT PRESIST IN DATABASE
    secret: process.env.ACCESS_TOKEN_SECRET,
    session: {
      // strategy: 'database',
      jwt: true,
      maxAge: 7 * 24 * 60 * 60,
    },
    jwt: {
      secret: process.env.JWT_TOKEN_SECRET,
      encryption: true,
    },
    callbacks: {
      // login: (user, account, profile) => {
      //   console.log('login callback here')
      //   return Promise.resolve(true)
      // },
      signIn: async ({ user, account, profile }) => {
        console.log('SIGNED IN', user)
        const isAllowedToSignIn = true
        if (isAllowedToSignIn) {
          // return '/account'
          return true
        } else {
          // Return false to display a default error message
          return false
          // Or you can return a URL to redirect to:
          // return '/unauthorized'
        }
      },
      // login: ({ user, account, profile, email, credentials }) => {
      //   console.log('here', credentials)
      //   return { name: 'test' }
      // },
      jwt: ({ token, user }) => {
        // first time jwt callback is run, user object is available
        console.log('JWT', token, 'USER', user)
        if (user) {
          token.user = user.user
          token.id = user.id
          return token
        }

        return token
      },
      session: ({ session, token }) => {
        console.log('SESSION', session)
        let test = { ...session.user, ...token.user }
        if (token) {
          session.id = token.user.id
          session.user = token.user ? token.user : { ...token.user, ...session.user }
          // session.user = test
        }
        console.log('SESSION2222', session)

        return session
      },
    },
  }
}

const authHandler = (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res))
}
export default authHandler
