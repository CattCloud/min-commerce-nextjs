import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

// Extensión de tipos para NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "admin" | "user"
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role?: "admin" | "user"
  }
}

// Extensión de tipos para JWT
declare module "next-auth/jwt" {
  interface JWT {
    sub?: string
    role?: "admin" | "user"
  }
}