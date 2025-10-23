import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react"

interface AdminStatsCardProps {
  title: string
  value: string | number
  icon: "package" | "shopping-cart" | "users" | "dollar-sign"
  trend?: string
  trendColor?: string
}

const iconMap = {
  "package": Package,
  "shopping-cart": ShoppingCart,
  "users": Users,
  "dollar-sign": DollarSign,
}

export function AdminStatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendColor = "text-gray-600" 
}: AdminStatsCardProps) {
  const IconComponent = iconMap[icon]
  
  const isPositiveTrend = trend?.startsWith('+')
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown

  return (
    <Card>
      <CardContent className="pt-2">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}