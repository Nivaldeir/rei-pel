import { db } from "@/services/database";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default NextAuth({
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
        if (!user) throw new Error("Usuário não cadastrado");
        const isCompare = user.password === password;
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
      //@ts-ignore
      session.user = token.user;
      return session;
    },
  },
});
