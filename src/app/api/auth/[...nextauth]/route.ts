import { db } from "@/services/database";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";

export const authNextOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {},
      authorize: async (credentials: any) => {
        const { email, password } = credentials;
        const user = await db.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) throw new Error("Usuario não cadastrado");
        const isCompare = user.password === password;
        // const isCompare = await new Password().compare(password, user.password);
        if (!isCompare) throw new Error("Senha incorreta");
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/auth",
    verifyRequest: "/auth",
    newUser: "/app",
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};
const handler = NextAuth(authNextOptions);
export { handler as GET, handler as POST };
