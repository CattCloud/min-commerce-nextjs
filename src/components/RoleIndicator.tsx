import { Badge } from "./ui/badge"
import { Shield, User } from "lucide-react"

interface RoleIndicatorProps {
  role: "admin" | "user" | undefined
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export default function RoleIndicator({ 
  role, 
  size = "sm", 
}: RoleIndicatorProps) {
  if (!role) return null

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  }



  const roleConfig = {
    admin: {
      label: "Admin",
      variant: "default" as const,
      bgColor: "bg-primary-200",
      textColor: "text-primary-900",
      borderColor: "border-primary-200",
      icon: Shield
    },
    user: {
      label: "Usuario",
      variant: "secondary" as const,
      bgColor: "bg-secondary-500",
      textColor: "text-text-primary",
      borderColor: "bg-secondary-500",
      icon: User
    }
  }

  const config = roleConfig[role]

  return (
    <Badge 
      className={`${sizeClasses[size]} ${config.bgColor} ${config.textColor} ${config.borderColor} border flex items-center gap-1 font-medium`}
    >
      {config.label}
    </Badge>
  )
}