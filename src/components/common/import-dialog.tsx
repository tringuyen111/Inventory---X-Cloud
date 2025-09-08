import * as React from "react"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"

import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Alert, AlertDescription } from "../ui/alert"
import { Badge } from "../ui/badge"
import { toast } from "sonner@2.0.3"

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  columns: string[]
  sampleData?: Record<string, string>[]
  onImport: (file: File) => void
}

export function ImportDialog({
  open,
  onOpenChange,
  title,
  description,
  columns,
  sampleData,
  onImport
}: ImportDialogProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [dragOver, setDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type.includes('csv') || droppedFile.type.includes('xlsx'))) {
      setFile(droppedFile)
    } else {
      toast.error("Please upload a CSV or XLSX file")
    }
  }

  const handleImport = () => {
    if (file) {
      onImport(file)
      setFile(null)
      onOpenChange(false)
    }
  }

  const downloadTemplate = () => {
    const headers = columns.join(',')
    const sampleRows = sampleData ? sampleData.map(row => 
      columns.map(col => row[col] || '').join(',')
    ).join('\n') : ''
    
    const content = `${headers}\n${sampleRows}`
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_template.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Required Columns */}
          <div>
            <Label className="text-sm font-medium">Required Columns:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {columns.map(column => (
                <Badge key={column} variant="outline" className="text-xs">
                  {column}
                </Badge>
              ))}
            </div>
          </div>

          {/* Template Download */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Download template with sample data</span>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadTemplate}
              >
                Download Template
              </Button>
            </AlertDescription>
          </Alert>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-2">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-green-600" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p>Drag and drop your file here, or click to browse</p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV and XLSX files
                  </p>
                </div>
              )}
            </div>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Choose File
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}