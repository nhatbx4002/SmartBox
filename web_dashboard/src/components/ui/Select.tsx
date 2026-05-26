import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  className?: string
  label?: string
}

// Radix Select doesn't allow empty string values — empty = use placeholder
const ALL_VALUE = '__all__'

export function Select({ value, onValueChange, placeholder, options, className, label }: SelectProps) {
  const safeValue = value === '' || value === undefined ? ALL_VALUE : value

  const handleChange = (newValue: string) => {
    onValueChange?.(newValue === ALL_VALUE ? '' : newValue)
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      )}
      <SelectPrimitive.Root value={safeValue} onValueChange={handleChange}>
        <SelectPrimitive.Trigger
          className={cn(
            'inline-flex items-center justify-between w-full h-11 px-4 rounded-lg',
            'bg-surface border border-border text-sm text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand',
            'transition-colors duration-150 cursor-pointer',
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="bg-surface border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-scale-in">
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value || ALL_VALUE}
                  value={opt.value || ALL_VALUE}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer',
                    'text-text-primary outline-none',
                    'data-[highlighted]:bg-surface-elevated data-[highlighted]:text-text-primary',
                  )}
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-3 w-3 text-brand" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}
