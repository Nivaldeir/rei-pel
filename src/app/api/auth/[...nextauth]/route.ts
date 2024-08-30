import { authNextOptions } from '@/config/auth-config'
import NextAuth from 'next-auth/next'

const handler = NextAuth(authNextOptions)
export { handler as GET, handler as POST }
