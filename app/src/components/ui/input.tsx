import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base layout
        "h-9 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm",
        // Placeholder
        "placeholder:text-muted-foreground",
        // Selection highlight
        "selection:bg-blue/20 selection:text-foreground",
        // Dark mode subtle bg tint
        "dark:bg-white/[0.04]",
        // Shadow
        "shadow-xs",
        // Transitions
        "transition-colors duration-150 outline-none",
        // Hover — subtle ring color tint on border
        "hover:border-ring/40",
        // File input reset
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Focus — blue ring
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        // Validation error
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
