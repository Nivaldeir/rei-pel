type GenericPropsDefault<T = unknown> = {
  children: React.ReactNode
  className?: string
} & T

declare module 'next-auth' {
  interface Session {
    user: {
      email: string
      sub: string
      id: string
      type: string
      city: string
      code: string
      representative: string
      isAdmin: boolean
      iat: number
      exp: number
      jti: string
    }
  }
}
