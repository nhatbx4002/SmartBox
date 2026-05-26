import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export function Modal({ open, onOpenChange, title, description, children, size = 'md', className }: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'bg-surface rounded-xl border border-border w-full shadow-2xl',
            'animate-scale-in',
            sizeClasses[size],
            className,
          )}
        >
          {title && (
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                <DialogPrimitive.Title className="text-lg font-semibold text-text-primary">
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="text-sm text-text-secondary mt-1">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              <DialogPrimitive.Close className="rounded-lg p-1 hover:bg-surface-elevated transition-colors cursor-pointer">
                <X className="h-4 w-4 text-text-muted" />
              </DialogPrimitive.Close>
            </div>
          )}
          <div className={cn('p-6', !title && 'pt-6')}>{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmDialog({
  open, onOpenChange, title, description,
  confirmLabel = 'Xác nhận', cancelLabel = 'Hủy bỏ',
  onConfirm, variant = 'danger', loading,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} size="sm">
      <p className="text-sm text-text-secondary mb-6">{description}</p>
      <div className="flex justify-end gap-3">
        <ModalClose asChild>
          <button className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:bg-surface-elevated transition-colors cursor-pointer">
            {cancelLabel}
          </button>
        </ModalClose>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            variant === 'danger'
              ? 'bg-error hover:bg-error/80 text-white'
              : 'bg-brand hover:bg-brand-hover text-white',
          )}
        >
          {loading ? 'Đang xử lý...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

Modal.Close = DialogPrimitive.Close
export const ModalClose = DialogPrimitive.Close
