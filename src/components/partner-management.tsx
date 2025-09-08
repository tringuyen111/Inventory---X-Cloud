import * as React from "react"
import { Search, Plus, Edit, Ban, Filter, Eye, CheckCircle } from "lucide-react"

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
import { Card, CardContent } from "./ui/card"
import { ViewDialog } from "./common/view-dialog"
import { toast } from "sonner@2.0.3"

// Mock data
const partners = [
  {
    id: 1,
    partnerCode: "CUST-001",
    partnerName: "Tech Solutions Inc.",
    type: "Customer",
    contactPerson: "Alice Johnson",
    phone: "+1-555-0101",
    email: "alice.johnson@techsolutions.com",
    taxCode: "TAX123456789",
    address: "456 Technology Drive, Innovation District, Tech City 12345",
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    partnerCode: "SUPP-001",
    partnerName: "Global Suppliers Ltd.",
    type: "Supplier",
    contactPerson: "Bob Smith",
    phone: "+1-555-0201",
    email: "bob.smith@globalsuppliers.com",
    taxCode: "TAX987654321",
    address: "789 Supply Chain Avenue, Industrial Zone, Supply City 67890",
    status: "Active",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12"
  },
  {
    id: 3,
    partnerCode: "BOTH-001",
    partnerName: "Integrated Business Corp.",
    type: "Both",
    contactPerson: "Carol Davis",
    phone: "+1-555-0301",
    email: "carol.davis@integratedbusiness.com",
    taxCode: "TAX456789123",
    address: "321 Commerce Street, Business District, Trade City 54321",
    status: "Active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: 4,
    partnerCode: "CUST-002",
    partnerName: "Retail Partners Co.",
    type: "Customer",
    contactPerson: "David Wilson",
    phone: "+1-555-0401",
    email: "david.wilson@retailpartners.com",
    taxCode: "TAX789123456",
    address: "654 Retail Boulevard, Shopping District, Retail City 98765",
    status: "Inactive",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-20"
  }
]

interface Partner {
  id?: number
  partnerCode: string
  partnerName: string
  type: string
  contactPerson: string
  phone: string
  email: string
  taxCode: string
  address: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export function PartnerManagement() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("All")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Partner | null>(null)
  const [viewingItem, setViewingItem] = React.useState<Partner | null>(null)
  const [formData, setFormData] = React.useState<Partner>({
    partnerCode: "",
    partnerName: "",
    type: "Customer",
    contactPerson: "",
    phone: "",
    email: "",
    taxCode: "",
    address: "",
    status: "Active"
  })

  const filteredData = partners.filter(item => {
    const matchesSearch = 
      item.partnerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.taxCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "All" || item.type === typeFilter
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreate = () => {
    setEditingItem(null)
    setFormData({
      partnerCode: "",
      partnerName: "",
      type: "Customer",
      contactPerson: "",
      phone: "",
      email: "",
      taxCode: "",
      address: "",
      status: "Active"
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (item: Partner) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleView = (item: Partner) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.partnerCode || !formData.partnerName || !formData.contactPerson || 
        !formData.phone || !formData.email || !formData.taxCode || !formData.address) {
      toast.error("Please fill in all required fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d\-\(\)\s]+$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error("Please enter a valid phone number")
      return
    }

    // Check for duplicate code
    const isDuplicate = partners.some(item => 
      item.partnerCode === formData.partnerCode && item.id !== editingItem?.id
    )
    if (isDuplicate) {
      toast.error("Partner Code already exists")
      return
    }

    if (editingItem) {
      toast.success("Partner updated successfully")
    } else {
      toast.success("Partner created successfully")
    }
    setIsDialogOpen(false)
  }

  const handleDeactivate = (item: Partner) => {
    toast.success(`Partner "${item.partnerName}" has been ${item.status === 'Active' ? 'deactivated' : 'activated'}`)
  }

  const getTypeVariant = (type: string): "default" | "secondary" | "outline" => {
    switch (type) {
      case 'Customer': return 'default'
      case 'Supplier': return 'secondary'
      case 'Both': return 'outline'
      default: return 'secondary'
    }
  }

  const getViewData = (item: Partner) => [
    { label: "Partner Code", value: item.partnerCode },
    { label: "Partner Name", value: item.partnerName },
    { 
      label: "Type", 
      value: item.type, 
      type: 'badge' as const, 
      variant: getTypeVariant(item.type)
    },
    { label: "Contact Person", value: item.contactPerson },
    { label: "Phone", value: item.phone },
    { label: "Email", value: item.email },
    { label: "Tax Code", value: item.taxCode },
    { label: "Address", value: item.address },
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
          <h1 className="text-3xl">Partner Management</h1>
          <p className="text-muted-foreground">Manage customers, suppliers, and business partners</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Partner
        </Button>
      </div>

      {/* Content - Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-1 items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
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
                <TableHead>Partner Code</TableHead>
                <TableHead>Partner Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone/Email</TableHead>
                <TableHead>Tax Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.partnerCode}</TableCell>
                  <TableCell>{item.partnerName}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeVariant(item.type)}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.contactPerson}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{item.phone}</p>
                      <p className="text-muted-foreground text-xs">{item.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.taxCode}</TableCell>
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
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Partner" : "Create New Partner"}
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? "Update the partner information below."
                : "Enter the details for the new partner."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="partnerCode" className="text-right">
                  Partner Code *
                </Label>
                <Input
                  id="partnerCode"
                  value={formData.partnerCode}
                  onChange={(e) => setFormData({ ...formData, partnerCode: e.target.value.toUpperCase() })}
                  className="col-span-3"
                  placeholder="e.g., CUST-001, SUPP-001"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="partnerName" className="text-right">
                  Partner Name *
                </Label>
                <Input
                  id="partnerName"
                  value={formData.partnerName}
                  onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                  className="col-span-3"
                  placeholder="Company or organization name"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type *
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactPerson" className="text-right">
                  Contact Person *
                </Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="col-span-3"
                  placeholder="Primary contact person"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-3"
                  placeholder="+1-555-0000"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                  placeholder="contact@company.com"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taxCode" className="text-right">
                  Tax Code *
                </Label>
                <Input
                  id="taxCode"
                  value={formData.taxCode}
                  onChange={(e) => setFormData({ ...formData, taxCode: e.target.value.toUpperCase() })}
                  className="col-span-3"
                  placeholder="TAX123456789"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="address" className="text-right pt-2">
                  Address *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="col-span-3"
                  placeholder="Full address including street, city, state, and zip code"
                  rows={3}
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
          title={`Partner: ${viewingItem.partnerName}`}
          data={getViewData(viewingItem)}
          onEdit={() => {
            setIsViewDialogOpen(false)
            handleEdit(viewingItem)
          }}
          className="sm:max-w-[700px]"
        />
      )}
    </div>
  )
}