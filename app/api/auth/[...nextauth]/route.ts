import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// App Router (NextAuth v4): reutilizamos el mismo handler para GET y POST
export { handler as GET, handler as POST };

