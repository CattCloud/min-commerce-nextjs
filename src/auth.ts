import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        if (token.role) {
          session.user.role = token.role
        }
      }
      return session
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        // Asignar rol basado en el email del usuario
        token.role = user.email === "erick.verde@unmsm.edu.pe" ? "admin" : "user"
      }
      return token
    },
  },
})