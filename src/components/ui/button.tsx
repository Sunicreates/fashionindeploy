import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "glass-bg text-gray-600 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-opacity-80 backdrop-blur-10",
        destructive: "bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-10",
        outline: "border-2 border-pink-200 glass-bg-alt text-gray-600 shadow-md hover:shadow-lg hover:scale-105 hover:border-pink-300",
        secondary: "glass-bg-alt text-gray-600 shadow-md hover:shadow-lg hover:scale-105",
        ghost: "text-gray-500 hover:text-gray-700 hover:bg-pink-50/50 backdrop-blur-5",
        link: "text-pink-400 underline-offset-4 hover:underline hover:text-pink-500",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 px-6 py-2 text-xs",
        lg: "h-14 px-10 py-4 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }