import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  loading?: boolean
}

const variantClasses = {
  primary: [
    'bg-brand text-white',
    'hover:brightness-110',
    'active:brightness-90 active:scale-[0.97]',
  ].join(' '),
  secondary: [
    'bg-surface-3 text-text-primary',
    'hover:bg-border',
    'active:bg-border/80 active:scale-[0.97]',
  ].join(' '),
  outline: [
    'border border-border text-text-primary bg-transparent',
    'hover:bg-surface-3 hover:border-border',
    'active:bg-surface-3/80 active:scale-[0.97]',
  ].join(' '),
  ghost: [
    'text-text-secondary bg-transparent',
    'hover:bg-surface-3 hover:text-text-primary',
    'active:bg-surface-3/80 active:scale-[0.97]',
  ].join(' '),
  danger: [
    'bg-error/15 text-error border border-error/25',
    'hover:bg-error/25 hover:border-error/40',
    'active:bg-error/30 active:scale-[0.97]',
  ].join(' '),
  success: [
    'bg-success/15 text-success border border-success/25',
    'hover:bg-success/25 hover:border-success/40',
    'active:bg-success/30 active:scale-[0.97]',
  ].join(' '),
}

const sizeClasses = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold',
          'transition-all duration-150 ease-spring',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none cursor-pointer',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 shrink-0 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'
