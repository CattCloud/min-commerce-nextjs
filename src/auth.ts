import NextAuth, { type NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import type { JWT } from "next-auth/jwt"
import type { AdapterSession } from "next-auth/adapters"
import type { PrismaClient as DbClient } from "@/prisma"

const db: DbClient = prisma as DbClient



// 🔹 Definimos un tipo compatible con la firma real de NextAuth
type SignOutEventMessage = {
  session?: void | AdapterSession | null
  token?: JWT | null
}

type TokenMessage = { token: JWT | null }
type SessionMessage = { session: AdapterSession | null | void }

function hasToken(m: SignOutEventMessage): m is TokenMessage {
  return typeof (m as { token?: JWT | null }).token !== "undefined"
}

function hasSession(m: SignOutEventMessage): m is SessionMessage {
  return typeof (m as { session?: AdapterSession | null | void }).session !== "undefined"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn() {
      return true
    },

    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        if (token.role) 
          session.user.role = token.role 
      }
      return session
    },

    jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role =
          user.email === "erick.verde@unmsm.edu.pe" ? "admin" : "user"
      }
      return token
    },
  },

  events: {
    async signIn({ user, account }) {
      try {
        await db.sessionLog.create({
          data: {
            userId: user.id,
            action: "login",
            provider: account?.provider ?? "unknown",
          },
        })
      } catch (error) {
        console.error("Error registrando login:", error)
      }
    },
    async signOut(message: SignOutEventMessage) {
      try {
        let userId: string | undefined

        if (hasToken(message) && message.token?.sub) {
          userId = message.token.sub
        } else if (hasSession(message) && message.session) {
          userId = (message.session as AdapterSession).userId
        }

        if (userId) {
          await db.sessionLog.create({
            data: {
              userId,
              action: "logout",
            },
          })
        }
      } catch (error) {
        console.error("Error registrando logout:", error)
      }
    },
  },
} satisfies NextAuthConfig)
