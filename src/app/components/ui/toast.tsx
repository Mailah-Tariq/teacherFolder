import { X } from 'lucide-react'

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  onClose?: () => void
}

export function Toast({
  className,
  title,
  description,
  onClose,
  ...props
}: ToastProps) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 w-full max-w-sm rounded-lg border bg-background p-6 shadow-lg",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && (
            <div className="mt-1 text-sm text-muted-foreground">{description}</div>
          )}
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    </div>
  )
}

