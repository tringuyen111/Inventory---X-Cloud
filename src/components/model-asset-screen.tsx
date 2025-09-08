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
import { Textarea } from "./ui/textarea"
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
    assetType: "Computer Equipment",
    uom: "PCS",
    managementType: "Serial",
    specs: "Intel i7, 16GB RAM, 512GB SSD, 15.6\" FHD Display",
    status: "Active"
  },
  {
    id: 2,
    modelCode: "TOY-CAMRY",
    modelName: "Toyota Camry 2024",
    assetType: "Vehicles", 
    uom: "UNIT",
    managementType: "Serial",
    specs: "2.5L Engine, Automatic Transmission, Hybrid",
    status: "Active"
  },
  {
    id: 3,
    modelCode: "DESK-ERG",
    modelName: "Ergonomic Office Desk",
    assetType: "Office Furniture",
    uom: "PCS", 
    managementType: "Batch",
    specs: "Height adjustable, 160cm x 80cm, Oak finish",
    status: "Active"
  },
  {
    id: 4,
    modelCode: "HP-PRINT",
    modelName: "HP LaserJet Pro",
    assetType: "Computer Equipment",
    uom: "PCS",
    managementType: "Serial", 
    specs: "Monochrome laser printer, 28 ppm, duplex printing",
    status: "Inactive"
  }
]

interface ModelAsset {
  id?: number
  modelCode: string
  modelName: string
  assetType: string
  uom: string
  managementType: string
  specs: string
  status: string
}

export function ModelAssetScreen() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [assetTypeFilter, setAssetTypeFilter] = React.useState("All")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [managementTypeFilter, setManagementTypeFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<ModelAsset | null>(null)
  const [viewingItem, setViewingItem] = React.useState<ModelAsset | null>(null)
  const [formData, setFormData] = React.useState<ModelAsset>({
    modelCode: "",
    modelName: "",
    assetType: "",
    uom: "",
    managementType: "Serial",
    specs: "",
    status: "Active"
  })

  const filteredData = modelAssets.filter(item => {
    const matchesSearch = 
      item.modelCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAssetType = assetTypeFilter === "All" || item.assetType === assetTypeFilter
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    const matchesManagementType = managementTypeFilter === "All" || item.managementType === managementTypeFilter
    
    return matchesSearch && matchesAssetType && matchesStatus && matchesManagementType
  })

  const handleCreate = () => {
    setEditingItem(null)
    setViewingItem(null)
    setFormData({
      modelCode: "",
      modelName: "",
      assetType: "",
      uom: "",
      managementType: "Serial",
      specs: "",
      status: "Active"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: ModelAsset) => {
    setEditingItem(item)
    setViewingItem(null)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleView = (item: ModelAsset) => {
    setViewingItem(item)
    setEditingItem(null)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.modelCode || !formData.modelName || !formData.assetType || !formData.uom) {
      toast.error("Please fill in all required fields")
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
    toast.success(`Model Asset "${item.modelName}" has been deactivated`)
  }

  const isReadOnly = !!viewingItem

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Model Asset Management</h1>
          <p className="text-muted-foreground">Manage asset models and their specifications</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Model Asset
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search model assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {assetTypes.filter(type => type.status === "Active").map(type => (
                <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={managementTypeFilter} onValueChange={setManagementTypeFilter}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Mgmt Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Serial">Serial</SelectItem>
              <SelectItem value="Batch">Batch</SelectItem>
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
              <TableHead>Model Code</TableHead>
              <TableHead>Model Name</TableHead>
              <TableHead>Asset Type</TableHead>
              <TableHead>UoM</TableHead>
              <TableHead>Management Type</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.modelCode}</TableCell>
                <TableCell>{item.modelName}</TableCell>
                <TableCell>{item.assetType}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {item.managementType}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{item.specs}</TableCell>
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
              {viewingItem ? "View Model Asset" : editingItem ? "Edit Model Asset" : "Create New Model Asset"}
            </DialogTitle>
            <DialogDescription>
              {viewingItem 
                ? "Model asset details and specifications."
                : editingItem 
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
                <Input
                  id="modelCode"
                  value={formData.modelCode}
                  onChange={(e) => setFormData({ ...formData, modelCode: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., DELL-L5520"
                  required
                  disabled={isReadOnly}
                />
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
                  disabled={isReadOnly}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assetType" className="text-right">
                  Asset Type *
                </Label>
                <Select
                  value={formData.assetType}
                  onValueChange={(value) => setFormData({ ...formData, assetType: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.filter(type => type.status === "Active").map(type => (
                      <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="uom" className="text-right">
                  UoM *
                </Label>
                <Select
                  value={formData.uom}
                  onValueChange={(value) => setFormData({ ...formData, uom: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select UoM" />
                  </SelectTrigger>
                  <SelectContent>
                    {uomList.filter(uom => uom.status === "Active").map(uom => (
                      <SelectItem key={uom.id} value={uom.code}>{uom.code} - {uom.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="managementType" className="text-right">
                  Management Type *
                </Label>
                <Select
                  value={formData.managementType}
                  onValueChange={(value) => setFormData({ ...formData, managementType: value })}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Serial">Serial</SelectItem>
                    <SelectItem value="Batch">Batch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="specs" className="text-right pt-2">
                  Specs
                </Label>
                <Textarea
                  id="specs"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  className="col-span-3"
                  placeholder="Technical specifications..."
                  rows={3}
                  disabled={isReadOnly}
                />
              </div>
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