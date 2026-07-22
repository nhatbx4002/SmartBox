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

const ALL_VALUE = '__all__'

export function Select({ value, onValueChange, placeholder, options, className, label }: SelectProps) {
  const safeValue = value === '' || value === undefined ? ALL_VALUE : value

  const handleChange = (newValue: string) => {
    onValueChange?.(newValue === ALL_VALUE ? '' : newValue)
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1.5">{label}</label>
      )}
      <SelectPrimitive.Root value={safeValue} onValueChange={handleChange}>
        <SelectPrimitive.Trigger
          className={cn(
            'inline-flex items-center justify-between w-full h-10 px-3.5 rounded-lg',
            'bg-white border border-gray-300 text-sm text-black',
            'transition-all duration-150 ease-spring cursor-pointer',
            // Focus state — inner glow ring
            'focus:outline-none focus:border-brand',
            'focus:shadow-[inset_0_0_0_1px_rgba(255,102,0,0.35),0_0_0_3px_rgba(255,102,0,0.12)]',
          )}
          style={{ colorScheme: 'dark' }}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="bg-white border border-gray-300 rounded-lg shadow-surface-lg z-50 overflow-hidden animate-scale-in"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((opt) => (
                <SelectPrimitive.Item
                  key={opt.value || ALL_VALUE}
                  value={opt.value || ALL_VALUE}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer select-none',
                    'text-gray-700 outline-none',
                    'data-[highlighted]:bg-gray-100 data-[highlighted]:text-black',
                    'data-[state=checked]:text-black',
                  )}
                >
                  <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2">
                    <Check className="h-3.5 w-3.5 text-brand" />
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
