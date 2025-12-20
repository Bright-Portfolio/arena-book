import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  handleGoogleUser,
  validateCredentials,
} from "./src/services/auth.service";
import { LoginSchema } from "./src/lib/validators/auth.schema";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      // 1. Define the form fields
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Passsword", type: "password" },
      },

      //2. The aithorize function
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const parsedCredentials = LoginSchema.safeParse(credentials);

        if (!parsedCredentials.success) return null;

        return await validateCredentials(parsedCredentials.data);
      },
    }),
  ],
  // 3. Create call back Signin and turn it inti JWT token,
  callbacks: {
    async signIn({ user, account }) {
      //Auto-create user for Google OAuth if not exist
      if (account?.provider === "google" && user.email && user.name) {
        await handleGoogleUser(user.email, user.name);
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = String(token.id);
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
});
