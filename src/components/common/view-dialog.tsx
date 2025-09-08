import * as React from "react"
import { X } from "lucide-react"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface ViewField {
  label: string
  value: string | React.ReactNode
  type?: 'text' | 'badge' | 'card'
  variant?: string
}

interface ViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  data: ViewField[]
  onEdit?: () => void
  className?: string
}

export function ViewDialog({
  open,
  onOpenChange,
  title,
  data,
  onEdit,
  className
}: ViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[600px] ${className}`}>
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex-1">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              View detailed information and properties.
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {data.map((field, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {field.label}
              </label>
              <div>
                {field.type === 'badge' && typeof field.value === 'string' ? (
                  <Badge variant={field.variant as any || 'default'}>
                    {field.value}
                  </Badge>
                ) : field.type === 'card' ? (
                  field.value
                ) : (
                  <p className="text-sm font-medium break-words">
                    {field.value || 'N/A'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}