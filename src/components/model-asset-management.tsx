import * as React from "react"
import { Search, Plus, Edit, Ban, Filter, Download, Upload, Eye, CheckCircle, Info } from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { ImportDialog } from "./common/import-dialog"
import { ViewDialog } from "./common/view-dialog"
import { toast } from "sonner@2.0.3"

// Mock data
const assetTypes = [
  { id: 1, code: "IT-001", name: "Computer Equipment", status: "Active" },
  { id: 2, code: "VH-001", name: "Vehicles", status: "Active" },
  { id: 3, code: "FUR-001", name: "Office Furniture", status: "Active" }
]

const uomList = [
  { id: 1, code: "PCS", name: "Pieces", status: "Active" },
  { id: 2, code: "SET", name: "Set", status: "Active" },
  { id: 3, code: "UNIT", name: "Unit", status: "Active" }
]

const modelAssets = [
  {
    id: 1,
    modelCode: "DELL-L5520",
    modelName: "Dell Latitude 5520",
    assetTypeCode: "IT-001",
    assetTypeName: "Computer Equipment",
    uomCode: "PCS",
    uomName: "Pieces",
    managementType: "Serial",
    specs: "Intel i7, 16GB RAM, 512GB SSD, 15.6\" FHD Display",
    status: "Active",
    hasTransactions: false,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    modelCode: "TOY-CAMRY",
    modelName: "Toyota Camry 2024",
    assetTypeCode: "VH-001",
    assetTypeName: "Vehicles", 
    uomCode: "UNIT",
    uomName: "Unit",
    managementType: "Serial",
    specs: "2.5L Engine, Automatic Transmission, Hybrid",
    status: "Active",
    hasTransactions: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: 3,
    modelCode: "DESK-ERG",
    modelName: "Ergonomic Office Desk",
    assetTypeCode: "FUR-001",
    assetTypeName: "Office Furniture",
    uomCode: "PCS",
    uomName: "Pieces", 
    managementType: "Batch",
    specs: "Height adjustable, 160cm x 80cm, Oak finish",
    status: "Active",
    hasTransactions: false,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08"
  },
  {
    id: 4,
    modelCode: "HP-PRINT",
    modelName: "HP LaserJet Pro",
    assetTypeCode: "IT-001",
    assetTypeName: "Computer Equipment",
    uomCode: "PCS",
    uomName: "Pieces",
    managementType: "Serial", 
    specs: "Monochrome laser printer, 28 ppm, duplex printing",
    status: "Inactive",
    hasTransactions: false,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20"
  }
]

interface ModelAsset {
  id?: number
  modelCode: string
  modelName: string
  assetTypeCode: string
  assetTypeName?: string
  uomCode: string
  uomName?: string
  managementType: string
  specs: string
  status: string
  hasTransactions?: boolean
  createdAt?: string
  updatedAt?: string
}

export function ModelAssetManagement() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [assetTypeFilter, setAssetTypeFilter] = React.useState("All")
  const [uomFilter, setUomFilter] = React.useState("All")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [managementTypeFilter, setManagementTypeFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<ModelAsset | null>(null)
  const [viewingItem, setViewingItem] = React.useState<ModelAsset | null>(null)
  const [formData, setFormData] = React.useState<ModelAsset>({
    modelCode: "",
    modelName: "",
    assetTypeCode: "",
    uomCode: "",
    managementType: "Serial",
    specs: "",
    status: "Active"
  })

  const filteredData = modelAssets.filter(item => {
    const matchesSearch = 
      item.modelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAssetType = assetTypeFilter === "All" || item.assetTypeCode === assetTypeFilter
    const matchesUom = uomFilter === "All" || item.uomCode === uomFilter
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    const matchesManagementType = managementTypeFilter === "All" || item.managementType === managementTypeFilter
    
    return matchesSearch && matchesAssetType && matchesUom && matchesStatus && matchesManagementType
  })

  const handleCreate = () => {
    setEditingItem(null)
    setFormData({
      modelCode: "",
      modelName: "",
      assetTypeCode: "",
      uomCode: "",
      managementType: "Serial",
      specs: "",
      status: "Active"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: ModelAsset) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleView = (item: ModelAsset) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.modelCode || !formData.modelName || !formData.assetTypeCode || !formData.uomCode) {
      toast.error("Please fill in all required fields")
      return
    }

    // Check for duplicate code
    const isDuplicate = modelAssets.some(item => 
      item.modelCode === formData.modelCode && item.id !== editingItem?.id
    )
    if (isDuplicate) {
      toast.error("Model Code already exists")
      return
    }

    if (editingItem) {
      toast.success("Model Asset updated successfully")
    } else {
      toast.success("Model Asset created successfully")
    }
    setIsDialogOpen(false)
  }

  const handleDeactivate = (item: ModelAsset) => {
    toast.success(`Model Asset "${item.modelName}" has been ${item.status === 'Active' ? 'deactivated' : 'activated'}`)
  }

  const handleExport = () => {
    const headers = ['model_code', 'model_name', 'asset_type_code', 'uom_code', 'specs', 'management_type', 'status']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.modelCode,
        `"${item.modelName}"`,
        item.assetTypeCode,
        item.uomCode,
        `"${item.specs}"`,
        item.managementType,
        item.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'model_assets.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Data exported successfully")
  }

  const handleImport = (file: File) => {
    toast.success(`Importing data from ${file.name}...`)
    setTimeout(() => {
      toast.success("Data imported successfully")
    }, 2000)
  }

  const getSelectedAssetType = () => assetTypes.find(at => at.code === formData.assetTypeCode)
  const getSelectedUom = () => uomList.find(u => u.code === formData.uomCode)

  const getViewData = (item: ModelAsset) => [
    { label: "Model Code", value: item.modelCode },
    { label: "Model Name", value: item.modelName },
    { 
      label: "Asset Type", 
      value: (
        <Card className="p-3 bg-muted/50">
          <div className="space-y-1">
            <p className="font-medium text-sm">{item.assetTypeName}</p>
            <p className="text-xs text-muted-foreground">{item.assetTypeCode}</p>
          </div>
        </Card>
      ),
      type: 'card' as const
    },
    { 
      label: "Unit of Measure", 
      value: (
        <Card className="p-3 bg-muted/50">
          <div className="space-y-1">
            <p className="font-medium text-sm">{item.uomName}</p>
            <p className="text-xs text-muted-foreground">{item.uomCode}</p>
          </div>
        </Card>
      ),
      type: 'card' as const
    },
    { 
      label: "Management Type", 
      value: item.managementType, 
      type: 'badge' as const, 
      variant: 'outline'
    },
    { 
      label: "Status", 
      value: item.status, 
      type: 'badge' as const, 
      variant: item.status === 'Active' ? 'default' : 'secondary'
    },
    { label: "Specifications", value: item.specs || "No specifications provided" },
    { label: "Created Date", value: new Date(item.createdAt || '').toLocaleDateString() },
    { label: "Last Updated", value: new Date(item.updatedAt || '').toLocaleDateString() }
  ]

  const importColumns = ['model_code', 'model_name', 'asset_type_code', 'uom_code', 'specs', 'management_type']
  const sampleData = [
    { 
      model_code: 'LAPTOP-001', 
      model_name: 'Business Laptop', 
      asset_type_code: 'IT-001', 
      uom_code: 'PCS', 
      specs: 'Intel i5, 8GB RAM, 256GB SSD',
      management_type: 'Serial'
    }
  ]

  return (
    <TooltipProvider>
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl">Model Asset Management</h1>
            <p className="text-muted-foreground">Manage asset models and their specifications</p>
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
              Create Model Asset
            </Button>
          </div>
        </div>

        {/* Content - Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-1 items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by code, name, or specs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    {assetTypes.filter(type => type.status === "Active").map(type => (
                      <SelectItem key={type.id} value={type.code}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={uomFilter} onValueChange={setUomFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="UoM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All UoM</SelectItem>
                    {uomList.filter(uom => uom.status === "Active").map(uom => (
                      <SelectItem key={uom.id} value={uom.code}>{uom.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={managementTypeFilter} onValueChange={setManagementTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Mgmt Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Serial">Serial</SelectItem>
                    <SelectItem value="Batch">Batch</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
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
                  <TableHead>Model Code</TableHead>
                  <TableHead>Model Name</TableHead>
                  <TableHead>Asset Type</TableHead>
                  <TableHead>UoM</TableHead>
                  <TableHead>Mgmt Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.modelCode}
                      {item.hasTransactions && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Locked
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.modelName}</TableCell>
                    <TableCell>{item.assetTypeName}</TableCell>
                    <TableCell>{item.uomCode}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.managementType}
                      </Badge>
                    </TableCell>
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Model Asset" : "Create New Model Asset"}
              </DialogTitle>
              <DialogDescription>
                {editingItem 
                  ? "Update the model asset information below."
                  : "Enter the details for the new model asset."
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="modelCode" className="text-right">
                    Model Code *
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="modelCode"
                      value={formData.modelCode}
                      onChange={(e) => setFormData({ ...formData, modelCode: e.target.value.toUpperCase() })}
                      placeholder="e.g., DELL-L5520"
                      required
                      disabled={editingItem?.hasTransactions}
                    />
                    {editingItem?.hasTransactions && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Code locked due to existing transactions
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="modelName" className="text-right">
                    Model Name *
                  </Label>
                  <Input
                    id="modelName"
                    value={formData.modelName}
                    onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                    className="col-span-3"
                    placeholder="Model name"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assetType" className="text-right">
                    Asset Type *
                  </Label>
                  <Select
                    value={formData.assetTypeCode}
                    onValueChange={(value) => {
                      const selectedType = assetTypes.find(at => at.code === value)
                      setFormData({ 
                        ...formData, 
                        assetTypeCode: value,
                        assetTypeName: selectedType?.name
                      })
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.filter(type => type.status === "Active").map(type => (
                        <SelectItem key={type.id} value={type.code}>
                          {type.name} ({type.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="uom" className="text-right">
                    UoM *
                  </Label>
                  <Select
                    value={formData.uomCode}
                    onValueChange={(value) => {
                      const selectedUom = uomList.find(u => u.code === value)
                      setFormData({ 
                        ...formData, 
                        uomCode: value,
                        uomName: selectedUom?.name
                      })
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select UoM" />
                    </SelectTrigger>
                    <SelectContent>
                      {uomList.filter(uom => uom.status === "Active").map(uom => (
                        <SelectItem key={uom.id} value={uom.code}>
                          {uom.code} - {uom.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Management Type *
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 ml-1 inline" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Serial: Track individual items with unique serial numbers</p>
                        <p>Batch: Track items in groups without individual identification</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <RadioGroup
                    value={formData.managementType}
                    onValueChange={(value) => setFormData({ ...formData, managementType: value })}
                    className="col-span-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Serial" id="serial" />
                      <Label htmlFor="serial">Serial</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Batch" id="batch" />
                      <Label htmlFor="batch">Batch</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="specs" className="text-right pt-2">
                    Specifications
                  </Label>
                  <Textarea
                    id="specs"
                    value={formData.specs}
                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                    className="col-span-3"
                    placeholder="Technical specifications..."
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
            title={`Model Asset: ${viewingItem.modelName}`}
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
          title="Model Assets"
          description="Import model assets from CSV or XLSX file"
          columns={importColumns}
          sampleData={sampleData}
          onImport={handleImport}
        />
      </div>
    </TooltipProvider>
  )
}