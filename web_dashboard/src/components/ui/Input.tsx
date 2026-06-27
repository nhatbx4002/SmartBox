import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, type = 'text', id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === 'password'
    const isDate = type === 'date'

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={cn(
              'w-full h-10 px-3.5 rounded-lg',
              'bg-white text-black text-sm',
              'placeholder:text-gray-400',
              'outline-none border border-border',
              'transition-all duration-150 ease-spring',
              // Focus state — inner glow ring
              'focus:border-brand',
              'focus:shadow-[inset_0_0_0_1px_rgba(255,102,0,0.35),0_0_0_3px_rgba(255,102,0,0.12)]',
              // Error state
              error && 'border-error',
              error && 'focus:shadow-[inset_0_0_0_1px_rgba(239,68,68,0.35),0_0_0_3px_rgba(239,68,68,0.12)]',
              isPassword && 'pr-11',
              className,
            )}
            ref={ref}
            style={isDate ? { colorScheme: 'dark' } : undefined}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary cursor-pointer transition-colors duration-150"
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="Claude Opus 4.6 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-error mt-1.5">{error}</p>}
        {helper && !error && <p className="text-xs text-text-muted mt-1.5">{helper}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
