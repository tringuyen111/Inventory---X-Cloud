import * as React from "react"
import { Search, Plus, Edit, Ban, Filter, Download, Upload, Eye, CheckCircle, MapPin } from "lucide-react"

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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ImportDialog } from "./common/import-dialog"
import { ViewDialog } from "./common/view-dialog"
import { toast } from "sonner@2.0.3"

// Mock data
const modelAssets = [
  { id: 1, code: "DELL-L5520", name: "Dell Latitude 5520", managementType: "Serial", status: "Active" },
  { id: 2, code: "TOY-CAMRY", name: "Toyota Camry 2024", managementType: "Serial", status: "Active" },
  { id: 3, code: "DESK-ERG", name: "Ergonomic Office Desk", managementType: "Batch", status: "Active" },
  { id: 4, code: "HP-PRINT", name: "HP LaserJet Pro", managementType: "Serial", status: "Active" }
]

const warehouses = [
  { 
    id: 1, 
    code: "WH-01",
    name: "Main Warehouse", 
    zones: [
      { 
        id: 1, 
        code: "A",
        name: "Zone A", 
        locations: [
          { id: 1, code: "A-01-01", name: "A-01-01" }, 
          { id: 2, code: "A-01-02", name: "A-01-02" }
        ] 
      },
      { 
        id: 2, 
        code: "B",
        name: "Zone B", 
        locations: [
          { id: 3, code: "B-01-01", name: "B-01-01" }, 
          { id: 4, code: "B-01-02", name: "B-01-02" }
        ] 
      }
    ]
  },
  { 
    id: 2, 
    code: "WH-02",
    name: "Secondary Warehouse", 
    zones: [
      { 
        id: 3, 
        code: "C",
        name: "Zone C", 
        locations: [
          { id: 5, code: "C-01-01", name: "C-01-01" }, 
          { id: 6, code: "C-01-02", name: "C-01-02" }
        ] 
      }
    ]
  }
]

const assets = [
  {
    id: 1,
    assetId: "AST-001",
    modelCode: "DELL-L5520",
    modelName: "Dell Latitude 5520",
    serialNumber: "DL5520-001",
    usageStatus: "InUse",
    warehouseCode: "WH-01",
    warehouseName: "Main Warehouse",
    zoneCode: "A",
    zoneName: "Zone A", 
    locationCode: "A-01-01",
    locationName: "A-01-01",
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    assetId: "AST-002",
    modelCode: "TOY-CAMRY",
    modelName: "Toyota Camry 2024",
    serialNumber: "TC2024-001",
    usageStatus: "InUse",
    warehouseCode: "WH-01",
    warehouseName: "Main Warehouse",
    zoneCode: "B",
    zoneName: "Zone B",
    locationCode: "B-01-01",
    locationName: "B-01-01", 
    status: "Active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: 3,
    assetId: "AST-003",
    modelCode: "DESK-ERG",
    modelName: "Ergonomic Office Desk",
    serialNumber: "",
    usageStatus: "Idle",
    warehouseCode: "WH-02",
    warehouseName: "Secondary Warehouse",
    zoneCode: "C",
    zoneName: "Zone C",
    locationCode: "C-01-01",
    locationName: "C-01-01",
    status: "Active",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08"
  },
  {
    id: 4,
    assetId: "AST-004", 
    modelCode: "HP-PRINT",
    modelName: "HP LaserJet Pro",
    serialNumber: "HP-LP-001",
    usageStatus: "Repair",
    warehouseCode: "WH-01",
    warehouseName: "Main Warehouse",
    zoneCode: "A",
    zoneName: "Zone A",
    locationCode: "A-01-02",
    locationName: "A-01-02",
    status: "Active",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20"
  }
]

interface Asset {
  id?: number
  assetId: string
  modelCode: string
  modelName?: string
  serialNumber: string
  usageStatus: string
  warehouseCode: string
  warehouseName?: string
  zoneCode: string
  zoneName?: string
  locationCode: string
  locationName?: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export function AssetListManagement() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [modelFilter, setModelFilter] = React.useState("All")
  const [usageStatusFilter, setUsageStatusFilter] = React.useState("All")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Asset | null>(null)
  const [viewingItem, setViewingItem] = React.useState<Asset | null>(null)
  const [formData, setFormData] = React.useState<Asset>({
    assetId: "",
    modelCode: "",
    serialNumber: "",
    usageStatus: "InUse",
    warehouseCode: "",
    zoneCode: "",
    locationCode: "",
    status: "Active"
  })

  const selectedModel = modelAssets.find(m => m.code === formData.modelCode)
  const selectedWarehouse = warehouses.find(w => w.code === formData.warehouseCode)
  const selectedZone = selectedWarehouse?.zones.find(z => z.code === formData.zoneCode)

  const filteredData = assets.filter(item => {
    const matchesSearch = 
      item.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModel = modelFilter === "All" || item.modelCode === modelFilter
    const matchesUsageStatus = usageStatusFilter === "All" || item.usageStatus === usageStatusFilter
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    
    return matchesSearch && matchesModel && matchesUsageStatus && matchesStatus
  })

  const handleCreate = () => {
    setEditingItem(null)
    // Generate next asset ID
    const nextId = `AST-${String(assets.length + 1).padStart(3, '0')}`
    setFormData({
      assetId: nextId,
      modelCode: "",
      serialNumber: "",
      usageStatus: "InUse",
      warehouseCode: "",
      zoneCode: "",
      locationCode: "",
      status: "Active"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: Asset) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleView = (item: Asset) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.modelCode || !formData.warehouseCode || !formData.zoneCode || !formData.locationCode) {
      toast.error("Please fill in all required fields")
      return
    }

    // Check if serial number is required
    if (selectedModel?.managementType === "Serial" && !formData.serialNumber) {
      toast.error("Serial number is required for this model")
      return
    }

    // Check for unique serial number within model
    if (selectedModel?.managementType === "Serial" && formData.serialNumber) {
      const isDuplicate = assets.some(item => 
        item.modelCode === formData.modelCode && 
        item.serialNumber === formData.serialNumber && 
        item.id !== editingItem?.id
      )
      if (isDuplicate) {
        toast.error("Serial number already exists for this model")
        return
      }
    }

    if (editingItem) {
      toast.success("Asset updated successfully")
    } else {
      toast.success("Asset created successfully")
    }
    setIsDialogOpen(false)
  }

  const handleDeactivate = (item: Asset) => {
    toast.success(`Asset "${item.assetId}" has been ${item.status === 'Active' ? 'deactivated' : 'activated'}`)
  }

  const handleExport = () => {
    const headers = ['asset_id', 'model_code', 'serial_number', 'usage_status', 'warehouse_code', 'zone_code', 'location_code', 'status']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.assetId,
        item.modelCode,
        item.serialNumber,
        item.usageStatus,
        item.warehouseCode,
        item.zoneCode,
        item.locationCode,
        item.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'assets.csv'
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

  const handleModelChange = (modelCode: string) => {
    const selectedModelData = modelAssets.find(m => m.code === modelCode)
    setFormData({ 
      ...formData, 
      modelCode,
      modelName: selectedModelData?.name,
      serialNumber: "" // Reset serial number when model changes
    })
  }

  const handleWarehouseChange = (warehouseCode: string) => {
    const selectedWarehouseData = warehouses.find(w => w.code === warehouseCode)
    setFormData({ 
      ...formData, 
      warehouseCode,
      warehouseName: selectedWarehouseData?.name,
      zoneCode: "",
      zoneName: "",
      locationCode: "",
      locationName: ""
    })
  }

  const handleZoneChange = (zoneCode: string) => {
    const selectedZoneData = selectedWarehouse?.zones.find(z => z.code === zoneCode)
    setFormData({ 
      ...formData, 
      zoneCode,
      zoneName: selectedZoneData?.name,
      locationCode: "",
      locationName: ""
    })
  }

  const handleLocationChange = (locationCode: string) => {
    const selectedLocationData = selectedZone?.locations.find(l => l.code === locationCode)
    setFormData({ 
      ...formData, 
      locationCode,
      locationName: selectedLocationData?.name
    })
  }

  const getUsageStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'InUse': 'default',
      'Idle': 'secondary', 
      'Repair': 'destructive',
      'Disposed': 'outline'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getViewData = (item: Asset) => [
    { label: "Asset ID", value: item.assetId },
    { 
      label: "Model", 
      value: (
        <Card className="p-3 bg-muted/50">
          <div className="space-y-1">
            <p className="font-medium text-sm">{item.modelName}</p>
            <p className="text-xs text-muted-foreground">{item.modelCode}</p>
          </div>
        </Card>
      ),
      type: 'card' as const
    },
    { label: "Serial Number", value: item.serialNumber || "N/A" },
    { 
      label: "Usage Status", 
      value: item.usageStatus, 
      type: 'badge' as const, 
      variant: getUsageStatusBadge(item.usageStatus).props.variant
    },
    { 
      label: "Location", 
      value: (
        <Card className="p-3 bg-muted/50">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="font-medium text-sm">{item.warehouseName}</span>
            </div>
            <div className="text-xs text-muted-foreground pl-4">
              <p>{item.zoneName} → {item.locationName}</p>
            </div>
          </div>
        </Card>
      ),
      type: 'card' as const
    },
    { 
      label: "Status", 
      value: item.status, 
      type: 'badge' as const, 
      variant: item.status === 'Active' ? 'default' : 'secondary'
    },
    { label: "Created Date", value: new Date(item.createdAt || '').toLocaleDateString() },
    { label: "Last Updated", value: new Date(item.updatedAt || '').toLocaleDateString() }
  ]

  const importColumns = ['model_code', 'serial_number', 'usage_status', 'warehouse_code', 'zone_code', 'location_code']
  const sampleData = [
    { 
      model_code: 'DELL-L5520', 
      serial_number: 'DL001', 
      usage_status: 'InUse', 
      warehouse_code: 'WH-01', 
      zone_code: 'A', 
      location_code: 'A-01-01'
    }
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Asset List Management</h1>
          <p className="text-muted-foreground">Manage individual assets and their locations</p>
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
            Create Asset
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
                placeholder="Search by asset ID, model, or serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Models</SelectItem>
                  {modelAssets.filter(model => model.status === "Active").map(model => (
                    <SelectItem key={model.id} value={model.code}>{model.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={usageStatusFilter} onValueChange={setUsageStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Usage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Usage</SelectItem>
                  <SelectItem value="InUse">In Use</SelectItem>
                  <SelectItem value="Idle">Idle</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Disposed">Disposed</SelectItem>
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
                <TableHead>Asset ID</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Barcode / Batch</TableHead>
                <TableHead>Usage Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.assetId}</TableCell>
                  <TableCell>{item.modelName}</TableCell>
                  <TableCell>{item.serialNumber || "N/A"}</TableCell>
                  <TableCell>{getUsageStatusBadge(item.usageStatus)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{item.warehouseName}</p>
                      <p className="text-muted-foreground text-xs">
                        {item.zoneName} → {item.locationName}
                      </p>
                    </div>
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
              {editingItem ? "Edit Asset" : "Create New Asset"}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? "Update the asset information below."
                : "Enter the details for the new asset."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetId" className="text-right">
                  Asset ID
                </Label>
                <Input
                  id="assetId"
                  value={formData.assetId}
                  className="col-span-3 bg-muted"
                  disabled
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">
                  Model *
                </Label>
                <Select
                  value={formData.modelCode}
                  onValueChange={handleModelChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelAssets.filter(model => model.status === "Active").map(model => (
                      <SelectItem key={model.id} value={model.code}>
                        {model.name} ({model.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedModel?.managementType === "Serial" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serialNumber" className="text-right">
                    Serial Number *
                  </Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter serial number"
                    required={selectedModel?.managementType === "Serial"}
                  />
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usageStatus" className="text-right">
                  Usage Status *
                </Label>
                <Select
                  value={formData.usageStatus}
                  onValueChange={(value) => setFormData({ ...formData, usageStatus: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="InUse">In Use</SelectItem>
                    <SelectItem value="Idle">Idle</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Disposed">Disposed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="warehouse" className="text-right">
                  Warehouse *
                </Label>
                <Select
                  value={formData.warehouseCode}
                  onValueChange={handleWarehouseChange}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.code}>
                        {warehouse.name} ({warehouse.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedWarehouse && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="zone" className="text-right">
                    Zone *
                  </Label>
                  <Select
                    value={formData.zoneCode}
                    onValueChange={handleZoneChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedWarehouse.zones.map(zone => (
                        <SelectItem key={zone.id} value={zone.code}>
                          {zone.name} ({zone.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedZone && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location *
                  </Label>
                  <Select
                    value={formData.locationCode}
                    onValueChange={handleLocationChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedZone.locations.map(location => (
                        <SelectItem key={location.id} value={location.code}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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
          title={`Asset: ${viewingItem.assetId}`}
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
        title="Assets"
        description="Import assets from CSV or XLSX file. Serial numbers are required for Serial models and must be unique within each model."
        columns={importColumns}
        sampleData={sampleData}
        onImport={handleImport}
      />
    </div>
  )
}