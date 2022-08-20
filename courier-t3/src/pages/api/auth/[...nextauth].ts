import NextAuth, { type NextAuthOptions } from 'next-auth'
// import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'

// Prisma adapter for NextAuth, optional and can be removed
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../server/db/client'

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    // session({ session, user }) {
    //   if (session.user) {
    //     session.user.id = user.id
    //   }
    //   return session
    // },
    jwt: async ({ token, user }) => {
      // first time jwt callback is run, user object is available
      // console.log('jwt', { token, user })
      if (user) {
        token.user = user
        token.id = user.id
        // console.log('JWT', token)
        return token
      }

      return token
    },
    session: async ({ session, token }) => {
      // let test = { ...session.user, ...token.user }
      if (token) {
        // TODO: typing for token.user, token.user created above
        session.user = { ...session.user, ...token.user }
        // session.user = token.user ? token.user : session.user
        // session.user = test
      }
      // console.log('session', { session, token })

      return session
    },
  },
  // Configure one or more authentication providers
  // adapter: PrismaAdapter(prisma),
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
      // TODO: dont know how to type this correctly
      authorize: async (credentials: any) => {
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
          }
        } else {
          console.log('nextauth signin error')
          return null
        }
      },
    }),
  ],
  session: {
    // strategy: 'database',
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
