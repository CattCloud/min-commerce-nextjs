"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Settings,
  LogOut,
  FileText
} from "lucide-react"
import { signOut } from "next-auth/react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Productos",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Órdenes",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Estadísticas",
    href: "/admin/stats",
    icon: BarChart3,
  },
  {
    name: "Logs",
    href: "/admin/logs",
    icon: FileText,
  },
  {
    name: "Configuración",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminNavigation() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Navegación
        </h2>
      </div>
      
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary-100 text-primary-900 border-r-2 border-primary-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        )
      })}
      
      <div className="pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
        >
          <LogOut
            className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}