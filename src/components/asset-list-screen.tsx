import * as React from "react"
import { Search, Plus, Edit, Ban, Filter, Eye } from "lucide-react"

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
import { toast } from "sonner@2.0.3"

// Mock data
const modelAssets = [
  { id: 1, code: "DELL-L5520", name: "Dell Latitude 5520", managementType: "Serial" },
  { id: 2, code: "TOY-CAMRY", name: "Toyota Camry 2024", managementType: "Serial" },
  { id: 3, code: "DESK-ERG", name: "Ergonomic Office Desk", managementType: "Batch" },
  { id: 4, code: "HP-PRINT", name: "HP LaserJet Pro", managementType: "Serial" }
]

const warehouses = [
  { id: 1, name: "Main Warehouse", zones: [
    { id: 1, name: "Zone A", locations: [{ id: 1, name: "A-01-01" }, { id: 2, name: "A-01-02" }] },
    { id: 2, name: "Zone B", locations: [{ id: 3, name: "B-01-01" }, { id: 4, name: "B-01-02" }] }
  ]},
  { id: 2, name: "Secondary Warehouse", zones: [
    { id: 3, name: "Zone C", locations: [{ id: 5, name: "C-01-01" }, { id: 6, name: "C-01-02" }] }
  ]}
]

const assets = [
  {
    id: 1,
    assetId: "AST-001",
    model: "Dell Latitude 5520",
    serialNumber: "DL5520-001",
    usageStatus: "InUse",
    warehouse: "Main Warehouse",
    zone: "Zone A", 
    location: "A-01-01",
    status: "Active"
  },
  {
    id: 2,
    assetId: "AST-002",
    model: "Toyota Camry 2024",
    serialNumber: "TC2024-001",
    usageStatus: "InUse",
    warehouse: "Main Warehouse",
    zone: "Zone B",
    location: "B-01-01", 
    status: "Active"
  },
  {
    id: 3,
    assetId: "AST-003",
    model: "Ergonomic Office Desk",
    serialNumber: "",
    usageStatus: "Idle",
    warehouse: "Secondary Warehouse",
    zone: "Zone C",
    location: "C-01-01",
    status: "Active"
  },
  {
    id: 4,
    assetId: "AST-004", 
    model: "HP LaserJet Pro",
    serialNumber: "HP-LP-001",
    usageStatus: "Repair",
    warehouse: "Main Warehouse",
    zone: "Zone A",
    location: "A-01-02",
    status: "Active"
  }
]

interface Asset {
  id?: number
  assetId: string
  model: string
  serialNumber: string
  usageStatus: string
  warehouse: string
  zone: string
  location: string
  status: string
}

export function AssetListScreen() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [modelFilter, setModelFilter] = React.useState("All")
  const [usageStatusFilter, setUsageStatusFilter] = React.useState("All")
  const [warehouseFilter, setWarehouseFilter] = React.useState("All")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Asset | null>(null)
  const [viewingItem, setViewingItem] = React.useState<Asset | null>(null)
  const [formData, setFormData] = React.useState<Asset>({
    assetId: "",
    model: "",
    serialNumber: "",
    usageStatus: "InUse",
    warehouse: "",
    zone: "",
    location: "",
    status: "Active"
  })

  const selectedModel = modelAssets.find(m => m.name === formData.model)
  const selectedWarehouse = warehouses.find(w => w.name === formData.warehouse)
  const selectedZone = selectedWarehouse?.zones.find(z => z.name === formData.zone)

  const filteredData = assets.filter(item => {
    const matchesSearch = 
      item.assetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModel = modelFilter === "All" || item.model === modelFilter
    const matchesUsageStatus = usageStatusFilter === "All" || item.usageStatus === usageStatusFilter
    const matchesWarehouse = warehouseFilter === "All" || item.warehouse === warehouseFilter
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    
    return matchesSearch && matchesModel && matchesUsageStatus && matchesWarehouse && matchesStatus
  })

  const handleCreate = () => {
    setEditingItem(null)
    setViewingItem(null)
    // Generate next asset ID
    const nextId = `AST-${String(assets.length + 1).padStart(3, '0')}`
    setFormData({
      assetId: nextId,
      model: "",
      serialNumber: "",
      usageStatus: "InUse",
      warehouse: "",
      zone: "",
      location: "",
      status: "Active"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: Asset) => {
    setEditingItem(item)
    setViewingItem(null)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleView = (item: Asset) => {
    setViewingItem(item)
    setEditingItem(null)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.model || !formData.warehouse || !formData.zone || !formData.location) {
      toast.error("Please fill in all required fields")
      return
    }

    // Check if serial number is required
    if (selectedModel?.managementType === "Serial" && !formData.serialNumber) {
      toast.error("Serial number is required for this model")
      return
    }

    if (editingItem) {
      toast.success("Asset updated successfully")
    } else {
      toast.success("Asset created successfully")
    }
    setIsDialogOpen(false)
  }

  const handleDeactivate = (item: Asset) => {
    toast.success(`Asset "${item.assetId}" has been deactivated`)
  }

  const handleModelChange = (modelName: string) => {
    setFormData({ 
      ...formData, 
      model: modelName,
      serialNumber: "" // Reset serial number when model changes
    })
  }

  const handleWarehouseChange = (warehouseName: string) => {
    setFormData({ 
      ...formData, 
      warehouse: warehouseName,
      zone: "",
      location: ""
    })
  }

  const handleZoneChange = (zoneName: string) => {
    setFormData({ 
      ...formData, 
      zone: zoneName,
      location: ""
    })
  }

  const isReadOnly = !!viewingItem

  const getUsageStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'InUse': 'default',
      'Idle': 'secondary', 
      'Repair': 'destructive',
      'Disposed': 'outline'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Asset List Management</h1>
          <p className="text-muted-foreground">Manage individual assets and their locations</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Asset
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={modelFilter} onValueChange={setModelFilter}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Models</SelectItem>
              {modelAssets.map(model => (
                <SelectItem key={model.id} value={model.name}>{model.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={usageStatusFilter} onValueChange={setUsageStatusFilter}>
            <SelectTrigger className="h-8 w-[120px]">
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
          
          <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Warehouses</SelectItem>
              {warehouses.map(warehouse => (
                <SelectItem key={warehouse.id} value={warehouse.name}>{warehouse.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[120px]">
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

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Usage Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.assetId}</TableCell>
                <TableCell>{item.model}</TableCell>
                <TableCell>{item.serialNumber || "N/A"}</TableCell>
                <TableCell>{getUsageStatusBadge(item.usageStatus)}</TableCell>
                <TableCell>{`${item.warehouse} > ${item.zone} > ${item.location}`}</TableCell>
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
                      {item.status === 'Active' && (
                        <DropdownMenuItem 
                          onClick={() => handleDeactivate(item)}
                          className="text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {viewingItem ? "View Asset" : editingItem ? "Edit Asset" : "Create New Asset"}
            </DialogTitle>
            <DialogDescription>
              {viewingItem 
                ? "Asset details and current location information."
                : editingItem 
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
                  className="col-span-3"
                  disabled
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">
                  Model *
                </Label>
                <Select
                  value={formData.model}
                  onValueChange={handleModelChange}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelAssets.map(model => (
                      <SelectItem key={model.id} value={model.name}>{model.name}</SelectItem>
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
                    disabled={isReadOnly}
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
                  disabled={isReadOnly}
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
                  value={formData.warehouse}
                  onValueChange={handleWarehouseChange}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map(warehouse => (
                      <SelectItem key={warehouse.id} value={warehouse.name}>{warehouse.name}</SelectItem>
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
                    value={formData.zone}
                    onValueChange={handleZoneChange}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedWarehouse.zones.map(zone => (
                        <SelectItem key={zone.id} value={zone.name}>{zone.name}</SelectItem>
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
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedZone.locations.map(location => (
                        <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                  disabled={isReadOnly}
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {isReadOnly ? "Close" : "Cancel"}
              </Button>
              {!isReadOnly && (
                <Button type="submit">
                  {editingItem ? "Update" : "Create"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}