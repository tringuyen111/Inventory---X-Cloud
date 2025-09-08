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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ViewDialog } from "./common/view-dialog"
import { toast } from "sonner@2.0.3"

// Mock data
const organizations = [
  {
    id: 1,
    orgCode: "ORG-001",
    orgName: "Headquarters",
    address: "123 Main Street, Business District, City 10001",
    contact: "John Doe (CEO) - +1-555-0100",
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    orgCode: "ORG-002", 
    orgName: "Regional Office North",
    address: "456 Oak Avenue, North District, City 20002",
    contact: "Jane Smith (Manager) - +1-555-0200",
    status: "Active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10"
  },
  {
    id: 3,
    orgCode: "ORG-003",
    orgName: "Regional Office South",
    address: "789 Pine Street, South District, City 30003",
    contact: "Bob Johnson (Manager) - +1-555-0300",
    status: "Inactive",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-20"
  }
]

const branches = [
  {
    id: 1,
    branchCode: "BR-001",
    branchName: "Main Branch",
    orgCode: "ORG-001",
    orgName: "Headquarters",
    address: "123 Main Street, Ground Floor, City 10001",
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    branchCode: "BR-002",
    branchName: "North Branch",
    orgCode: "ORG-002",
    orgName: "Regional Office North",
    address: "456 Oak Avenue, 2nd Floor, City 20002", 
    status: "Active",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12"
  },
  {
    id: 3,
    branchCode: "BR-003",
    branchName: "South Branch",
    orgCode: "ORG-003",
    orgName: "Regional Office South",
    address: "789 Pine Street, 1st Floor, City 30003",
    status: "Inactive",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20"
  }
]

interface Organization {
  id?: number
  orgCode: string
  orgName: string
  address: string
  contact: string
  status: string
  createdAt?: string
  updatedAt?: string
}

interface Branch {
  id?: number
  branchCode: string
  branchName: string
  orgCode: string
  orgName?: string
  address: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export function OrganizationManagement() {
  const [activeTab, setActiveTab] = React.useState("organization")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("All")
  const [orgFilter, setOrgFilter] = React.useState("All")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<Organization | Branch | null>(null)
  const [viewingItem, setViewingItem] = React.useState<Organization | Branch | null>(null)
  const [formData, setFormData] = React.useState<Organization | Branch>({
    orgCode: "",
    orgName: "",
    address: "",
    contact: "",
    status: "Active"
  })

  const activeOrganizations = organizations.filter(org => org.status === "Active")

  const filteredOrganizations = organizations.filter(item => {
    const matchesSearch = 
      item.orgCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contact.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredBranches = branches.filter(item => {
    const matchesSearch = 
      item.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    const matchesOrg = orgFilter === "All" || item.orgCode === orgFilter
    return matchesSearch && matchesStatus && matchesOrg
  })

  const handleCreate = (type: 'organization' | 'branch') => {
    setEditingItem(null)
    if (type === 'organization') {
      setFormData({
        orgCode: "",
        orgName: "",
        address: "",
        contact: "",
        status: "Active"
      })
    } else {
      setFormData({
        branchCode: "",
        branchName: "",
        orgCode: "",
        address: "",
        status: "Active"
      })
    }
    setIsDialogOpen(true)
  }

  const handleEdit = (item: Organization | Branch) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleView = (item: Organization | Branch) => {
    setViewingItem(item)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (activeTab === 'organization') {
      const orgData = formData as Organization
      if (!orgData.orgCode || !orgData.orgName || !orgData.address || !orgData.contact) {
        toast.error("Please fill in all required fields")
        return
      }
      
      // Check for duplicate code
      const isDuplicate = organizations.some(item => 
        item.orgCode === orgData.orgCode && item.id !== editingItem?.id
      )
      if (isDuplicate) {
        toast.error("Organization Code already exists")
        return
      }
    } else {
      const branchData = formData as Branch
      if (!branchData.branchCode || !branchData.branchName || !branchData.orgCode || !branchData.address) {
        toast.error("Please fill in all required fields")
        return
      }
      
      // Check for duplicate code
      const isDuplicate = branches.some(item => 
        item.branchCode === branchData.branchCode && item.id !== editingItem?.id
      )
      if (isDuplicate) {
        toast.error("Branch Code already exists")
        return
      }
    }

    if (editingItem) {
      toast.success(`${activeTab === 'organization' ? 'Organization' : 'Branch'} updated successfully`)
    } else {
      toast.success(`${activeTab === 'organization' ? 'Organization' : 'Branch'} created successfully`)
    }
    setIsDialogOpen(false)
  }

  const handleDeactivate = (item: Organization | Branch) => {
    const type = 'orgCode' in item ? 'Organization' : 'Branch'
    const name = 'orgName' in item ? item.orgName : (item as Branch).branchName
    toast.success(`${type} "${name}" has been ${item.status === 'Active' ? 'deactivated' : 'activated'}`)
  }

  const getViewData = (item: Organization | Branch) => {
    if ('orgCode' in item) {
      const org = item as Organization
      return [
        { label: "Organization Code", value: org.orgCode },
        { label: "Organization Name", value: org.orgName },
        { label: "Address", value: org.address },
        { label: "Contact", value: org.contact },
        { 
          label: "Status", 
          value: org.status, 
          type: 'badge' as const, 
          variant: org.status === 'Active' ? 'default' : 'secondary'
        },
        { label: "Created Date", value: new Date(org.createdAt || '').toLocaleDateString() },
        { label: "Last Updated", value: new Date(org.updatedAt || '').toLocaleDateString() }
      ]
    } else {
      const branch = item as Branch
      return [
        { label: "Branch Code", value: branch.branchCode },
        { label: "Branch Name", value: branch.branchName },
        { 
          label: "Organization", 
          value: (
            <Card className="p-3 bg-muted/50">
              <div className="space-y-1">
                <p className="font-medium text-sm">{branch.orgName}</p>
                <p className="text-xs text-muted-foreground">{branch.orgCode}</p>
              </div>
            </Card>
          ),
          type: 'card' as const
        },
        { label: "Address", value: branch.address },
        { 
          label: "Status", 
          value: branch.status, 
          type: 'badge' as const, 
          variant: branch.status === 'Active' ? 'default' : 'secondary'
        },
        { label: "Created Date", value: new Date(branch.createdAt || '').toLocaleDateString() },
        { label: "Last Updated", value: new Date(branch.updatedAt || '').toLocaleDateString() }
      ]
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Organization & Branch Management</h1>
          <p className="text-muted-foreground">Manage organizational structure and branch locations</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="branch">Branch</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Organizations</h2>
            <Button onClick={() => handleCreate('organization')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Organization
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex flex-1 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search organizations..."
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

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Org Code</TableHead>
                    <TableHead>Org Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.orgCode}</TableCell>
                      <TableCell>{item.orgName}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.address}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.contact}</TableCell>
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
        </TabsContent>

        <TabsContent value="branch" className="space-y-4">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Branches</h2>
            <Button onClick={() => handleCreate('branch')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Branch
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-1 items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search branches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={orgFilter} onValueChange={setOrgFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Organizations</SelectItem>
                      {activeOrganizations.map(org => (
                        <SelectItem key={org.id} value={org.orgCode}>{org.orgName}</SelectItem>
                      ))}
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

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch Code</TableHead>
                    <TableHead>Branch Name</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.branchCode}</TableCell>
                      <TableCell>{item.branchName}</TableCell>
                      <TableCell>{item.orgName}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.address}</TableCell>
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
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem 
                ? `Edit ${activeTab === 'organization' ? 'Organization' : 'Branch'}` 
                : `Create New ${activeTab === 'organization' ? 'Organization' : 'Branch'}`
              }
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? `Update the ${activeTab === 'organization' ? 'organization' : 'branch'} information below.`
                : `Enter the details for the new ${activeTab === 'organization' ? 'organization' : 'branch'}.`
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {activeTab === 'organization' ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="orgCode" className="text-right">
                      Org Code *
                    </Label>
                    <Input
                      id="orgCode"
                      value={(formData as Organization).orgCode}
                      onChange={(e) => setFormData({ ...formData, orgCode: e.target.value.toUpperCase() })}
                      className="col-span-3"
                      placeholder="e.g., ORG-001"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="orgName" className="text-right">
                      Org Name *
                    </Label>
                    <Input
                      id="orgName"
                      value={(formData as Organization).orgName}
                      onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                      className="col-span-3"
                      placeholder="Organization name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address *
                    </Label>
                    <Input
                      id="address"
                      value={(formData as Organization).address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="col-span-3"
                      placeholder="Full address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      Contact *
                    </Label>
                    <Input
                      id="contact"
                      value={(formData as Organization).contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="col-span-3"
                      placeholder="Contact person and details"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="branchCode" className="text-right">
                      Branch Code *
                    </Label>
                    <Input
                      id="branchCode"
                      value={(formData as Branch).branchCode}
                      onChange={(e) => setFormData({ ...formData, branchCode: e.target.value.toUpperCase() })}
                      className="col-span-3"
                      placeholder="e.g., BR-001"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="branchName" className="text-right">
                      Branch Name *
                    </Label>
                    <Input
                      id="branchName"
                      value={(formData as Branch).branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                      className="col-span-3"
                      placeholder="Branch name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="organization" className="text-right">
                      Organization *
                    </Label>
                    <Select
                      value={(formData as Branch).orgCode}
                      onValueChange={(value) => {
                        const selectedOrg = activeOrganizations.find(org => org.orgCode === value)
                        setFormData({ 
                          ...formData, 
                          orgCode: value,
                          orgName: selectedOrg?.orgName
                        })
                      }}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeOrganizations.map(org => (
                          <SelectItem key={org.id} value={org.orgCode}>
                            {org.orgName} ({org.orgCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="branchAddress" className="text-right">
                      Address *
                    </Label>
                    <Input
                      id="branchAddress"
                      value={(formData as Branch).address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="col-span-3"
                      placeholder="Branch address"
                      required
                    />
                  </div>
                </>
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
          title={`${('orgCode' in viewingItem) ? 'Organization' : 'Branch'}: ${
            ('orgName' in viewingItem) ? viewingItem.orgName : (viewingItem as Branch).branchName
          }`}
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