import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapater, PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

export default NextAuth({
  // adapter: PrismaAdapter(prisma),
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
      authorize: async (credentials, req) => {
        // database look up
        if (credentials.email === 'john' && credentials.password === 'test') {
          return {
            id: 2,
            name: 'John',
            email: 'johndoe@test.com',
          }
        }

        // login failed
        return null
        // try {
        //   const loginValues = {
        //     email: credentials.email,
        //     password: credentials.password,
        //   }
        //   let response
        //   await axios
        //     .post('http://localhost:3000/user/login', loginValues)
        //     .then((res) => {
        //       response = res
        //     })
        //     .catch((error) => {
        //       if (error.response) {
        //         console.log(error.response.status)
        //         response = error.response
        //       } else if (error.request) {
        //         console.log(error.request)
        //       } else {
        //         // Something happened in setting up the request that triggered an Error
        //         console.log('Error', error.message)
        //       }
        //       console.log(error.config)
        //     })
        //   return response
        // } catch (err) {
        //   console.error(err)
        // }

        // const res = await fetch('/your/endpoint', {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { 'Content-Type': 'application/json' },
        // })
        // const user = await res.json()

        // // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user
        // }
        // // Return null if user data could not be retrieved
        // return null
      },
    }),
  ],
  callbacks: {
    // login: (user, account, profile) => {
    //   console.log('login callback here')
    //   return Promise.resolve(true)
    // },
    jwt: ({ token, user }) => {
      // first time jwt callback is run, user object is available
      if (user) {
        token.id = user.id
      }

      return token
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id
      }

      return session
    },
  },
  secret: 'test',
  jwt: {
    secret: 'test',
    encryption: true,
  },
  // pages: {
  //   signIn: '/api/auth',
  // },
  session: {
    jwt: true,
  },
})
