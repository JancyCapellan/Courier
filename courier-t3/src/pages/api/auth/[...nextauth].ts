import NextAuth, { User, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../server/db/client'
import { JWT } from 'next-auth/jwt'

//credentials procider signs in and sends its object with some defaults to jwt callback, the return token is sent to session callback to be used in the app with useSession. JWT callback gives us a chance to customize what is being sent to the client side

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  debug: true,
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      console.log("redirect url:", url)
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },

    jwt: async ({ token, user, account, profile, isNewUser }) => {
      // first time jwt callback is run, user object is available
      console.log('first pass jwt', token)

      if (account) {
        token.accessToken = account.access_token
      }
      if (user) {
        token.user = user
        token.role = user.role
        token.id = user.id
        // token.id = user.id
        console.log('JWT', token)
        return token
      }

      console.log("FINAL TOKEN:", token)

      return token
    },
    session: async ({ session, token }) => {
      // let test = { ...session.user, ...token.user }
      console.log("SESSION ", session, "TOKEN", token);
      
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        // session.user = token
        // session.user = token.user
        // session.user.role = token.role
        // session.jwt = token.jwt
        // session.user = token.user ? token.user : session.user
        // session.user = test
      }
      
      
      console.log('nextauth session:', session)

      return session
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
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
      // TODO create database look up so username/Email is case insensitive, customer123@email.com === CUSTOMER123@email.com === CUStoMEr123@email.com
      authorize: async (credentials) => {

        if( credentials === undefined || credentials.email === undefined || credentials.password === undefined)
        return null

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
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          } as JWT
        } else {
          console.log('nextauth signin error')
          // return process.env.NEXTAUTH_URL + '/?signInError=true'
          return null
        }

      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
}

export default NextAuth(authOptions)
