import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/services/database";

const authNextOptions: NextAuthOptions = {
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
    error: "/",
    verifyRequest: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};

export {authNextOptions};