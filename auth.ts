import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import pool from "@/src/lib/db";

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

        const email = credentials.email as string;
        const password = credentials.password as string;

        const result = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        const user = result.rows[0];

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await compare(password, user.password);

        if (!isValidPassword) {
          return null;
        }
        // Success return user data without password!
        return {
          id: user.id.toString(), //convert to string because in database ID type is number but NextAuth expected string
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  // 3. Create call back Signin and turn it inti JWT token,
  callbacks: {
    async signIn({ user, account }) {
      //Auto-create user for Google OAuth if not exist
      if (account?.provider === "google") {
        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [user.email]
        );

        if (rows.length === 0) {
          await pool.query(
            "INSERT INTO users (email, name, auth_provider) VALUES ($1, $2, $3)",
            [user.email, user.name, "google"]
          );
        }
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
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
});
