import * as React from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  /** Label affiché au-dessus du champ */
  label?: string
  /** Message d'erreur — active le style destructive si présent */
  error?: string
  /** Active le style success (border verte) */
  isValid?: boolean
  /** Texte d'aide affiché sous le champ quand pas d'erreur */
  hint?: string
  /** Affiche un astérisque rouge */
  required?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Wrapper de champ de formulaire.
 * Gère : label stylé, bordure d'état (erreur/succès), message d'erreur/hint.
 * Utilise des sélecteurs Tailwind arbitraires ([&_input], [&_textarea])
 * pour propager l'état visuel au(x) champ(s) enfant(s) sans cloneElement.
 */
function FormField({
  label,
  error,
  isValid,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  const id = React.useId()

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-destructive">
              *
            </span>
          )}
        </label>
      )}

      {/* Applique la bordure d'état aux inputs/textareas enfants */}
      <div
        className={cn(
          error && [
            '[&_input]:border-destructive [&_textarea]:border-destructive [&_select]:border-destructive',
            '[&_input]:ring-2 [&_input]:ring-destructive/20 [&_textarea]:ring-2 [&_textarea]:ring-destructive/20',
          ],
          isValid &&
            !error && [
              '[&_input]:border-success [&_textarea]:border-success [&_select]:border-success',
            ],
        )}
      >
        {/* Inject l'id sur le premier input/textarea pour le htmlFor du label */}
        {React.Children.map(children, (child, i) => {
          if (i === 0 && React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ id?: string; 'aria-invalid'?: boolean }>, {
              id,
              'aria-invalid': error ? true : undefined,
            })
          }
          return child
        })}
      </div>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

export { FormField }
export type { FormFieldProps }
