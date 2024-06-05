import NextAuth from "next-auth";
import { authNextOptions } from "./authNextOptions";


const handler = NextAuth(authNextOptions);
export { handler as GET, handler as POST };
