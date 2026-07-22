import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

interface Tab {
  value: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, value, onValueChange, className }: TabsProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange} className={cn('w-full', className)}>
      <TabsPrimitive.List className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors duration-150',
              'relative cursor-pointer',
              'data-[state=active]:text-brand data-[state=inactive]:text-text-muted',
              'hover:text-text-secondary',
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
              'after:rounded-full after:transition-colors',
              'data-[state=active]:after:bg-brand data-[state=inactive]:after:bg-transparent',
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  )
}

export function TabContent({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsPrimitive.Content value={value} className="mt-4 animate-fade-in">
      {children}
    </TabsPrimitive.Content>
  )
}
