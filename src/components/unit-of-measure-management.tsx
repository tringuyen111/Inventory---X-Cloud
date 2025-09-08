import * as React from "react"
import { Search, Plus, Edit, Ban, Eye, CheckCircle } from "lucide-react"

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
import { Card, CardContent } from "./ui/card"
import { ViewDialog } from "./common/view-dialog"
import { toast } from "sonner@2.0.3"

// Mock data
const unitsOfMeasure = [
  {
    id: 1,
    uomCode: "PCS",
    uomName: "Pieces",
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    uomCode: "SET",
    uomName: "Set",
    status: "Active",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14"
  },
  {
    id: 3,
    uomCode: "UNIT",
    uomName: "Unit",
    status: "Active",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13"
  },
  {
    id: 4,
    uomCode: "KG",
    uomName: "Kilogram",
    status: "Active",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12"
  },
  {
    id: 5,
    uomCode: "LB",
    uomName: "Pound",
    status: "Active",
    createdAt: "2024-01-11",
    updatedAt: "2024-01-11"
  },
  {
    id: 6,
    uomCode: "M",
    uomName: "Meter",
    status: "Active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: 7,
    uomCode: "FT",
    uomName: "Feet",
    status: "Active",
    createdAt: "2024-01-09",
    updatedAt: "2024-01-09"
  },
  {
    id: 8,
    uomCode: "L",
    uomName: "Liter",
    status: "Active",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08"
  },
  {
    id: 9,
    uomCode: "GAL",
    uomName: "Gallon",
    status: "Active",
    createdAt: "2024-01-07",
    updatedAt: "2024-01-07"
  },
  {
    id: 10,
    uomCode: "BOX",
    uomName: "Box",
    status: "Inactive",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-20"
  }
]

interface UnitOfMeasure {
  id?: number
  uomCode: string
  uomName: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export function UnitOfMeasureManagement() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<UnitOfMeasure | null>(null)
  const [viewingItem, setViewingItem] = React.useState<UnitOfMeasure | null>(null)
  const [formData, setFormData] = React.useState<UnitOfMeasure>({
    uomCode: "",
    uomName: "",
    status: "Active"
  })

  const filteredData = unitsOfMeasure.filter(item => {
    const matchesSearch = 
      item.uomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.uomName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    setEditingItem(null)
    setFormData({
      uomCode: "",
      uomName: "",
      status: "Active"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: UnitOfMeasure) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleView = (item: UnitOfMeasure) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.uomCode || !formData.uomName) {
      toast.error("Please fill in all required fields")
      return
    }

    // Check for duplicate code
    const isDuplicate = unitsOfMeasure.some(item => 
      item.uomCode.toLowerCase() === formData.uomCode.toLowerCase() && item.id !== editingItem?.id
    )
    if (isDuplicate) {
      toast.error("UoM Code already exists")
      return
    }

    // Check for duplicate name
    const isDuplicateName = unitsOfMeasure.some(item => 
      item.uomName.toLowerCase() === formData.uomName.toLowerCase() && item.id !== editingItem?.id
    )
    if (isDuplicateName) {
      toast.error("UoM Name already exists")
      return
    }

    if (editingItem) {
      toast.success("Unit of Measure updated successfully")
    } else {
      toast.success("Unit of Measure created successfully")
    }
    setIsDialogOpen(false)
  }

  const handleDeactivate = (item: UnitOfMeasure) => {
    toast.success(`Unit of Measure "${item.uomName}" has been ${item.status === 'Active' ? 'deactivated' : 'activated'}`)
  }

  const getViewData = (item: UnitOfMeasure) => [
    { label: "UoM Code", value: item.uomCode },
    { label: "UoM Name", value: item.uomName },
    { 
      label: "Status", 
      value: item.status, 
      type: 'badge' as const, 
      variant: item.status === 'Active' ? 'default' : 'secondary'
    },
    { label: "Created Date", value: new Date(item.createdAt || '').toLocaleDateString() },
    { label: "Last Updated", value: new Date(item.updatedAt || '').toLocaleDateString() }
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Unit of Measure (UoM) Management</h1>
          <p className="text-muted-foreground">Manage measurement units for inventory and assets</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create UoM
        </Button>
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
                <TableHead>UoM Code</TableHead>
                <TableHead>UoM Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.uomCode}</TableCell>
                  <TableCell>{item.uomName}</TableCell>
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
              {editingItem ? "Edit Unit of Measure" : "Create New Unit of Measure"}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? "Update the unit of measure information below."
                : "Enter the details for the new unit of measure."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="uomCode" className="text-right">
                  UoM Code *
                </Label>
                <div className="col-span-3 space-y-1">
                  <Input
                    id="uomCode"
                    value={formData.uomCode}
                    onChange={(e) => setFormData({ ...formData, uomCode: e.target.value.toUpperCase() })}
                    placeholder="e.g., PCS, KG, M"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Short code for the unit (usually 2-4 characters)
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="uomName" className="text-right">
                  UoM Name *
                </Label>
                <Input
                  id="uomName"
                  value={formData.uomName}
                  onChange={(e) => setFormData({ ...formData, uomName: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Pieces, Kilogram, Meter"
                  required
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
          title={`Unit of Measure: ${viewingItem.uomName}`}
          data={getViewData(viewingItem)}
          onEdit={() => {
            setIsViewDialogOpen(false)
            handleEdit(viewingItem)
          }}
        />
      )}
    </div>
  )
}