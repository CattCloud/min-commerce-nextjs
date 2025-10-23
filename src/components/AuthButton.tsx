"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button"
import { User, LogIn, LogOut, Loader2 } from "lucide-react"
import RoleIndicator from "./RoleIndicator"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <Button disabled>
        <Loader2 className="animate-spin h-4 w-4 mr-2" />
        Cargando...
      </Button>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/profile"
          className="flex items-center text-sm text-text-secondary hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 gap-1"
        >
          <User className="h-4 w-4 mr-2" />
          {session.user?.name}
          <RoleIndicator role={session.user?.role} size="sm" />
        </Link>
        <Button
          onClick={() => signOut()}
          variant="destructive"
          size="sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => signIn("google")}
      variant="default"
      size="sm"
    >
      <LogIn className="h-4 w-4 mr-2" />
      Iniciar con Google
    </Button>
  )
}