import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminNavigation } from "@/components/admin/AdminNavigation"
import RoleIndicator from "@/components/RoleIndicator"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Verificación de rol en servidor - seguridad adicional
  if (!session || session.user?.role !== "admin") {
    redirect("/unauthorized")
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4  py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navegación lateral */}
          <aside className="lg:w-64 flex-shrink-0">
            <AdminNavigation />
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}