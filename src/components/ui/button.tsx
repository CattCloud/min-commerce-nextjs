import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variantClasses = {
      default: "cursor-pointer bg-[var(--color-primary-500)] text-[var(--color-bg-app)] hover:bg-[var(--color-primary-600)]",
      destructive: "cursor-pointer bg-[var(--color-error)] text-[var(--color-bg-app)] hover:bg-[var(--color-error)]/90",
      outline: "cursor-pointer text-[var(--color-primary-500)] border-[var(--color-border-default)] bg-[var(--color-bg-app)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]",
      secondary: "cursor-pointer bg-[var(--color-secondary-500)] text-[var(--color-bg-app)] hover:bg-[var(--color-secondary-600)]",
      ghost: "cursor-pointer hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]",
      link: "cursor-pointer text-[var(--color-primary-500)] underline-offset-4 hover:underline",
    }

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }