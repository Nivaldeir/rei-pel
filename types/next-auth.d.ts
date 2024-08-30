import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: User
  }
}

export type User = {
  id: number,
  city: string,
  code: string,
  representative: string,
  email: string,
  password: string,
  isAdmin: boolean,
} 
