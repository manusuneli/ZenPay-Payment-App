import { NextAuthOptions, DefaultSession } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@repo/db/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phoneNumber?: string;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    phoneNumber?: string;
  }
}

const cookiePrefix = process.env.NODE_ENV === "production" ? "__Secure-" : "";
const useSecureCookies = process.env.NODE_ENV === "production";

const signinObj = z.object({
  phone: z.string().min(10),
  password: z.string().min(6).max(20),
});

const signupObj = z.object({
  phone: z.string().min(10),
  password: z.string().min(6).max(20),
  name: z.string().min(1),
  email: z.string().email(),
});

function getAccountNumber(): string {
  const digits = "0123456789";
  return Array.from({ length: 4 })
    .map(() =>
      Array.from({ length: 4 })
        .map(() => digits[Math.floor(Math.random() * digits.length)])
        .join("")
    )
    .join("-");
}

export const NEXT_AUTH: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "signin",
      name: "Sign In",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signinObj.safeParse(credentials);
        if (!parsed.success) return null;
        const { phone, password } = parsed.data;

        const user = await prisma.user.findFirst({ where: { number: phone } });
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          number: user.number,
        };
      },
    }),

    CredentialsProvider({
      id: "signup",
      name: "Sign Up",
      credentials: {
        name: { label: "Name", type: "text" },
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const parsed = signupObj.safeParse(credentials);
        if (!parsed.success) return null;
        const { name, phone, password, email } = parsed.data;

        const exists = await prisma.user.findFirst({ where: { number: phone } });
        if (exists) return null;

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({ data: { name, number: phone, email, password: hashed, MPIN: "" } });
        await prisma.balance.create({ data: { userId: user.id, amount: 0, locked: 0 } });

        return { id: user.id.toString(), name: user.name, email: user.email, number: user.number };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET as string,

  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies },
    },
    csrfToken: {
      name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies, maxAge: 900 },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies, maxAge: 900 },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: useSecureCookies },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phoneNumber = (user as any).number;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.phoneNumber = token.phoneNumber;
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  } as any,
};

export default NextAuth(NEXT_AUTH)