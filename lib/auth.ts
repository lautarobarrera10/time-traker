import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Configuración principal de NextAuth (v4).
 * Usamos estrategia JWT sin base de datos.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        (token as any).provider = account.provider;
        (token as any).picture =
          (profile as any).picture ?? (token as any).picture;
        token.name = (profile as any).name ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name ?? session.user.name;
        session.user.image =
          (token as any).picture ?? session.user.image ?? undefined;
      }
      return session;
    },
  },
};

