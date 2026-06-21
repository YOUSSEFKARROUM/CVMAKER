import * as React from 'react'
import { cn } from '@/lib/utils'
import { CARD_STYLES, RADIUS } from '@/styles/design-system'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding scale: compact (p-4) | standard (p-6) | marketing (p-8) */
  variant?: keyof typeof CARD_STYLES
  /** Adds a hover border tint and smooth transition */
  hover?: boolean
}

function Card({
  variant = 'standard',
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card border border-border',
        RADIUS.md,
        CARD_STYLES[variant],
        hover && 'transition-colors duration-150 hover:border-[hsl(var(--blue))]/30',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
export type { CardProps }
