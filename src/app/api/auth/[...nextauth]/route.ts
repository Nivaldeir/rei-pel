import { authNextOptions } from "@/lib/config-auth";
import NextAuth from "next-auth";


const handler = NextAuth(authNextOptions);
export { handler as GET, handler as POST };
