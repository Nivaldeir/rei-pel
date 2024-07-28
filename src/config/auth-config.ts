// @ts-nocheck
import { db } from '@/lib/db'
import { NextAuthOptions } from 'next-auth'

import { createHash } from 'crypto'
import Credentials from 'next-auth/providers/credentials'
import { User } from '../../types/next-auth'

export const authNextOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {},
      authorize: async (credentials: any) => {
        const { email, password } = credentials
        const user = await db.user.findUnique({
          where: {
            email,
          },
        })
        if (!user) throw new Error('Usuario não cadastrado')
        const hashPassowrd = createHash('sha256')
          .update(password)
          .digest('hex')
          console.log(user)
        if (user.password !== hashPassowrd) throw new Error("Senha ou usuario incorreto")
        return {
          id: user.id,
          type: user.type,
          city: user.city,
          code: user.code,
          representative: user.representative,
          email: user.email,
          isAdmin: user.isAdmin,
        }

      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    error: '/',
    verifyRequest: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user }
      }
      return token
    },
    async session({ session, token }) {
      session.user = token as User
      return session
    },
  },
}
