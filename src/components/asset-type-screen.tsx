import * as React from "react"
import { Search, Plus, Edit, Ban, Filter } from "lucide-react"

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
  {
    id: 1,
    typeCode: "IT-001",
    typeName: "Computer Equipment",
    description: "Desktop computers, laptops, servers, and related IT equipment",
    status: "Active"
  },
  {
    id: 2,
    typeCode: "VH-001", 
    typeName: "Vehicles",
    description: "Company vehicles including cars, trucks, and forklifts",
    status: "Active"
  },
  {
    id: 3,
    typeCode: "FUR-001",
    typeName: "Office Furniture",
    description: "Desks, chairs, cabinets, and other office furniture",
    status: "Active"
  },
  {
    id: 4,
    typeCode: "MC-001",
    typeName: "Manufacturing Equipment",
    description: "Production machinery and manufacturing tools",
    status: "Inactive"
  }
]

interface AssetType {
  id?: number
  typeCode: string
  typeName: string
  description: string
  status: string
}

export function AssetTypeScreen() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<AssetType | null>(null)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.typeCode || !formData.typeName) {
      toast.error("Please fill in all required fields")
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
    toast.success(`Asset Type "${item.typeName}" has been deactivated`)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Asset Type Management</h1>
          <p className="text-muted-foreground">Manage asset type categories and classifications</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Asset Type
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search asset types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[120px]">
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

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type Code</TableHead>
              <TableHead>Type Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.typeCode}</TableCell>
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
        <DialogContent className="sm:max-w-[425px]">
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
                <Input
                  id="typeCode"
                  value={formData.typeCode}
                  onChange={(e) => setFormData({ ...formData, typeCode: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., IT-001"
                  required
                />
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
    </div>
  )
}