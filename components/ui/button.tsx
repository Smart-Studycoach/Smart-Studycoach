import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button style variants using class-variance-authority.
 * Provides consistent styling across different button types and sizes.
 * 
 * Available variants:
 * - default: Primary button with brand colors
 * - destructive: Red button for dangerous actions
 * - outline: Button with border and transparent background
 * - secondary: Alternative styling for secondary actions
 * - ghost: Minimal styling, shows background on hover
 * - link: Text-only button with underline on hover
 * 
 * Available sizes:
 * - default: Standard button size (h-9)
 * - sm: Small button (h-8)
 * - lg: Large button (h-10)
 * - icon: Square icon button (size-9)
 * - icon-sm: Small icon button (size-8)
 * - icon-lg: Large icon button (size-10)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button component with variant and size support.
 * 
 * @param variant - Visual style variant: "default", "destructive", "outline", "secondary", "ghost", or "link"
 * @param size - Size variant: "default", "sm", "lg", "icon", "icon-sm", or "icon-lg"
 * @param asChild - When true, merges props with child element instead of rendering a button.
 *                  Useful with Radix UI Slot to render the button as a different element (e.g., a link).
 * 
 * @example
 * ```tsx
 * // Standard button
 * <Button variant="default">Click me</Button>
 * 
 * // Destructive button
 * <Button variant="destructive">Delete</Button>
 * 
 * // Button as a link using asChild
 * <Button asChild>
 *   <a href="/page">Go to page</a>
 * </Button>
 * 
 * // Icon button
 * <Button variant="ghost" size="icon">
 *   <Icon />
 * </Button>
 * ```
 */
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
