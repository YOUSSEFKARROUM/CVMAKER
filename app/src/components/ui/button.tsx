import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base — inline-flex, focus ring, disabled, icon sizing, tactile feedback
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
    "transition-all duration-150",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ],
  {
    variants: {
      variant: {
        // Dark solid — primary action (near-black in light, near-white in dark)
        default:
          "bg-primary text-primary-foreground hover:bg-primary/85 active:bg-primary/75",

        // Blue — unique CTA (sign in, download, pay). Carries shadow-cta in light mode.
        blue:
          "bg-blue text-blue-foreground hover:bg-blue/90 active:bg-blue/80 shadow-cta",

        // Destructive — irreversible actions
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/40",

        // Subtle border — secondary choice alongside a primary button
        outline:
          "border border-border bg-transparent hover:bg-surface-1 hover:text-foreground active:bg-surface-2",

        // Filled muted — less prominent than default, more than ghost
        secondary:
          "bg-surface-2 text-foreground hover:bg-surface-3 active:bg-surface-3/70",

        // No background — icon buttons, contextual actions
        ghost:
          "hover:bg-surface-1 hover:text-foreground active:bg-surface-2",

        // Inline text link
        link:
          "text-blue underline-offset-4 hover:underline h-auto p-0",
      },
      size: {
        default:   "h-9 px-4 py-2 has-[>svg]:px-3",
        sm:        "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg:        "h-10 rounded-lg px-5 has-[>svg]:px-4 text-sm",
        xl:        "h-11 rounded-lg px-6 has-[>svg]:px-5 text-base font-semibold",
        icon:      "size-9",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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
