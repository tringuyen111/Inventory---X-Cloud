import * as React from "react"
import { Search, Plus, Edit, Ban, Filter, Download, Upload, Eye, CheckCircle } from "lucide-react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ImportDialog } from "./common/import-dialog"
import { ViewDialog } from "./common/view-dialog"
import { toast } from "sonner@2.0.3"

// Mock data
const assetTypes = [
  {
    id: 1,
    typeCode: "IT-001",
    typeName: "Computer Equipment",
    description: "Desktop computers, laptops, servers, and related IT equipment",
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    typeCode: "VH-001", 
    typeName: "Vehicles",
    description: "Company vehicles including cars, trucks, and forklifts",
    status: "Active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: 3,
    typeCode: "FUR-001",
    typeName: "Office Furniture",
    description: "Desks, chairs, cabinets, and other office furniture",
    status: "Active",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08"
  },
  {
    id: 4,
    typeCode: "MC-001",
    typeName: "Manufacturing Equipment",
    description: "Production machinery and manufacturing tools",
    status: "Inactive",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20"
  }
]

interface AssetType {
  id?: number
  typeCode: string
  typeName: string
  description: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export function AssetTypeManagement() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<AssetType | null>(null)
  const [viewingItem, setViewingItem] = React.useState<AssetType | null>(null)
  const [formData, setFormData] = React.useState<AssetType>({
    typeCode: "",
    typeName: "",
    description: "",
    status: "Active"
  })

  const filteredData = assetTypes.filter(item => {
    const matchesSearch = 
      item.typeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    setEditingItem(null)
    setFormData({
      typeCode: "",
      typeName: "",
      description: "",
      status: "Active"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: AssetType) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleView = (item: AssetType) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const codeRegex = /^[A-Z]{2,4}-\d{3}$/
    if (!codeRegex.test(formData.typeCode)) {
      toast.error("Type Code must follow format: XX-000 (2-4 letters, dash, 3 digits)")
      return
    }

    if (!formData.typeName.trim()) {
      toast.error("Type Name is required")
      return
    }

    // Check for duplicate code
    const isDuplicate = assetTypes.some(item => 
      item.typeCode === formData.typeCode && item.id !== editingItem?.id
    )
    if (isDuplicate) {
      toast.error("Type Code already exists")
      return
    }

    if (editingItem) {
      toast.success("Asset Type updated successfully")
    } else {
      toast.success("Asset Type created successfully")
    }
    setIsDialogOpen(false)
  }

  const handleDeactivate = (item: AssetType) => {
    toast.success(`Asset Type "${item.typeName}" has been ${item.status === 'Active' ? 'deactivated' : 'activated'}`)
  }

  const handleExport = () => {
    const headers = ['type_code', 'type_name', 'description', 'status']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.typeCode,
        `"${item.typeName}"`,
        `"${item.description}"`,
        item.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'asset_types.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Data exported successfully")
  }

  const handleImport = (file: File) => {
    // Simulate import processing
    toast.success(`Importing data from ${file.name}...`)
    setTimeout(() => {
      toast.success("Data imported successfully")
    }, 2000)
  }

  const handleCodeChange = (value: string) => {
    // Auto-uppercase
    setFormData({ ...formData, typeCode: value.toUpperCase() })
  }

  const getViewData = (item: AssetType) => [
    { label: "Type Code", value: item.typeCode },
    { label: "Type Name", value: item.typeName },
    { 
      label: "Status", 
      value: item.status, 
      type: 'badge' as const, 
      variant: item.status === 'Active' ? 'default' : 'secondary'
    },
    { label: "Description", value: item.description || "No description provided" },
    { label: "Created Date", value: new Date(item.createdAt || '').toLocaleDateString() },
    { label: "Last Updated", value: new Date(item.updatedAt || '').toLocaleDateString() }
  ]

  const importColumns = ['type_code', 'type_name', 'description']
  const sampleData = [
    { type_code: 'EQ-001', type_name: 'Equipment', description: 'General equipment' },
    { type_code: 'TOOL-001', type_name: 'Tools', description: 'Hand tools and power tools' }
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Asset Type Management</h1>
          <p className="text-muted-foreground">Manage asset type categories and classifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Asset Type
          </Button>
        </div>
      </div>

      {/* Content - Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content - Table */}
      <Card className="flex-1">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type Code</TableHead>
                <TableHead>Type Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.typeCode}</TableCell>
                  <TableCell>{item.typeName}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeactivate(item)}
                          className={item.status === 'Active' ? 'text-destructive' : 'text-green-600'}
                        >
                          {item.status === 'Active' ? (
                            <>
                              <Ban className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Asset Type" : "Create New Asset Type"}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? "Update the asset type information below."
                : "Enter the details for the new asset type."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="typeCode" className="text-right">
                  Type Code *
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="typeCode"
                    value={formData.typeCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="e.g., IT-001"
                    required
                    pattern="^[A-Z]{2,4}-\d{3}$"
                    title="Format: XX-000 (2-4 letters, dash, 3 digits)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: XX-000 (2-4 letters, dash, 3 digits)
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="typeName" className="text-right">
                  Type Name *
                </Label>
                <Input
                  id="typeName"
                  value={formData.typeName}
                  onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                  className="col-span-3"
                  placeholder="Asset type name"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Describe this asset type..."
                  rows={3}
                />
              </div>
              {editingItem && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingItem ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewingItem && (
        <ViewDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          title={`Asset Type: ${viewingItem.typeName}`}
          data={getViewData(viewingItem)}
          onEdit={() => {
            setIsViewDialogOpen(false)
            handleEdit(viewingItem)
          }}
        />
      )}

      {/* Import Dialog */}
      <ImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        title="Asset Types"
        description="Import asset types from CSV or XLSX file"
        columns={importColumns}
        sampleData={sampleData}
        onImport={handleImport}
      />
    </div>
  )
}