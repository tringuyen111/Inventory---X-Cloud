import * as React from "react"
import { 
  Search, Plus, Edit, Ban, Filter, ChevronRight, ChevronDown, 
  Warehouse, MapPin, Box, Eye, CheckCircle, Download, Settings,
  Calendar, User, MoreHorizontal
} from "lucide-react"

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
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
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
const branches = [
  { id: 1, code: "BR-001", name: "Main Branch", status: "Active" },
  { id: 2, code: "BR-002", name: "North Branch", status: "Active" }
]

const warehouses = [
  {
    id: 1,
    warehouseCode: "WH-001",
    warehouseName: "Main Warehouse",
    branchCode: "BR-001",
    branchName: "Main Branch",
    address: "123 Storage Ave, Industrial Zone",
    manager: "John Smith",
    status: "Active",
    lastUpdated: "2024-01-15",
    updatedBy: "admin",
    zones: [
      {
        id: 1,
        zoneCode: "A",
        zoneName: "Zone A - Electronics",
        warehouseCode: "WH-001",
        status: "Active",
        lastUpdated: "2024-01-12",
        updatedBy: "manager1",
        locations: [
          { 
            id: 1, 
            binCode: "A-01-01", 
            binName: "Shelf A-01-01", 
            zoneCode: "A", 
            capacity: "100 units", 
            status: "Active",
            lastUpdated: "2024-01-10",
            updatedBy: "staff1"
          },
          { 
            id: 2, 
            binCode: "A-01-02", 
            binName: "Shelf A-01-02", 
            zoneCode: "A", 
            capacity: "150 units", 
            status: "Active",
            lastUpdated: "2024-01-08",
            updatedBy: "staff2"
          },
          { 
            id: 3, 
            binCode: "A-02-01", 
            binName: "Shelf A-02-01", 
            zoneCode: "A", 
            capacity: "200 units", 
            status: "Active",
            lastUpdated: "2024-01-05",
            updatedBy: "staff1"
          }
        ]
      },
      {
        id: 2,
        zoneCode: "B",
        zoneName: "Zone B - Furniture",
        warehouseCode: "WH-001",
        status: "Active",
        lastUpdated: "2024-01-14",
        updatedBy: "manager2",
        locations: [
          { 
            id: 4, 
            binCode: "B-01-01", 
            binName: "Section B-01-01", 
            zoneCode: "B", 
            capacity: "50 units", 
            status: "Active",
            lastUpdated: "2024-01-11",
            updatedBy: "staff3"
          },
          { 
            id: 5, 
            binCode: "B-01-02", 
            binName: "Section B-01-02", 
            zoneCode: "B", 
            capacity: "75 units", 
            status: "Active",
            lastUpdated: "2024-01-09",
            updatedBy: "staff2"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    warehouseCode: "WH-002",
    warehouseName: "North Warehouse",
    branchCode: "BR-002",
    branchName: "North Branch",
    address: "456 Storage Blvd, North District",
    manager: "Sarah Johnson",
    status: "Active",
    lastUpdated: "2024-01-13",
    updatedBy: "admin",
    zones: [
      {
        id: 3,
        zoneCode: "C",
        zoneName: "Zone C - General",
        warehouseCode: "WH-002",
        status: "Active",
        lastUpdated: "2024-01-07",
        updatedBy: "manager3",
        locations: [
          { 
            id: 6, 
            binCode: "C-01-01", 
            binName: "Rack C-01-01", 
            zoneCode: "C", 
            capacity: "300 units", 
            status: "Active",
            lastUpdated: "2024-01-06",
            updatedBy: "staff4"
          }
        ]
      }
    ]
  }
]

interface TreeNode {
  id: string
  type: 'warehouse' | 'zone' | 'location'
  code: string
  name: string
  status: string
  children?: TreeNode[]
  expanded?: boolean
  data?: any
}

interface FormData {
  warehouseCode?: string
  warehouseName?: string
  branchCode?: string
  address?: string
  manager?: string
  zoneCode?: string
  zoneName?: string
  binCode?: string
  binName?: string
  capacity?: string
  status: string
}

interface ColumnVisibility {
  [key: string]: boolean
}

export function WarehouseStructureManagement() {
  const [activeTab, setActiveTab] = React.useState<'summary' | 'detail'>('summary')
  const [selectedLevel, setSelectedLevel] = React.useState<'warehouse' | 'zone' | 'location'>('warehouse')
  const [selectedNode, setSelectedNode] = React.useState<TreeNode | null>(null)
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set(['warehouse']))
  const [searchTerm, setSearchTerm] = React.useState("")
  const [branchFilter, setBranchFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = React.useState(false)
  const [detailItem, setDetailItem] = React.useState<any>(null)
  const [editingItem, setEditingItem] = React.useState<any>(null)
  const [viewingItem, setViewingItem] = React.useState<any>(null)
  const [formData, setFormData] = React.useState<FormData>({ status: "Active" })

  // Column visibility for different levels
  const [warehouseColumns, setWarehouseColumns] = React.useState<ColumnVisibility>({
    code: true,
    name: true,
    branch: true,
    address: true,
    manager: true,
    status: true
  })

  const [zoneColumns, setZoneColumns] = React.useState<ColumnVisibility>({
    code: true,
    name: true,
    warehouse: true,
    status: true
  })

  const [locationColumns, setLocationColumns] = React.useState<ColumnVisibility>({
    binCode: true,
    binName: true,
    zone: true,
    capacity: true,
    status: true
  })

  const [summaryColumns, setSummaryColumns] = React.useState<ColumnVisibility>({
    branch: true,
    warehouseCode: true,
    warehouseName: true,
    totalZones: true,
    totalLocations: true,
    status: true
  })

  const buildTreeData = (): TreeNode[] => {
    return warehouses.map(warehouse => ({
      id: `warehouse-${warehouse.id}`,
      type: 'warehouse',
      code: warehouse.warehouseCode,
      name: warehouse.warehouseName,
      status: warehouse.status,
      data: warehouse,
      expanded: expandedNodes.has(`warehouse-${warehouse.id}`),
      children: warehouse.zones.map(zone => ({
        id: `zone-${zone.id}`,
        type: 'zone',
        code: zone.zoneCode,
        name: zone.zoneName,
        status: zone.status,
        data: { ...zone, warehouseName: warehouse.warehouseName },
        expanded: expandedNodes.has(`zone-${zone.id}`),
        children: zone.locations.map(location => ({
          id: `location-${location.id}`,
          type: 'location',
          code: location.binCode,
          name: location.binName,
          status: location.status,
          data: { 
            ...location, 
            warehouseName: warehouse.warehouseName,
            warehouseCode: warehouse.warehouseCode,
            zoneName: zone.zoneName
          }
        }))
      }))
    }))
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const selectNode = (node: TreeNode) => {
    setSelectedNode(node)
    setSelectedLevel(node.type)
  }

  const getSummaryData = () => {
    return warehouses.map(warehouse => ({
      id: warehouse.id,
      branch: warehouse.branchName,
      warehouseCode: warehouse.warehouseCode,
      warehouseName: warehouse.warehouseName,
      totalZones: warehouse.zones.length,
      totalLocations: warehouse.zones.reduce((total, zone) => total + zone.locations.length, 0),
      status: warehouse.status,
      data: warehouse
    }))
  }

  const getDetailData = () => {
    if (selectedNode?.type === 'warehouse') {
      return selectedNode.data.zones || []
    } else if (selectedNode?.type === 'zone') {
      return selectedNode.data.locations || []
    } else if (selectedLevel === 'warehouse') {
      return warehouses
    } else {
      return []
    }
  }

  const filteredSummaryData = React.useMemo(() => {
    let data = getSummaryData()
    
    if (searchTerm) {
      data = data.filter(item => 
        item.warehouseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.branch.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (branchFilter && branchFilter !== "all") {
      data = data.filter(item => item.data.branchCode === branchFilter)
    }
    
    if (statusFilter && statusFilter !== "all") {
      data = data.filter(item => item.status === statusFilter)
    }
    
    return data
  }, [searchTerm, branchFilter, statusFilter])

  const filteredDetailData = React.useMemo(() => {
    let data = getDetailData()
    
    if (searchTerm) {
      data = data.filter((item: any) => {
        const searchFields = [
          item.warehouseCode, item.warehouseName, item.zoneCode, 
          item.zoneName, item.binCode, item.binName
        ].filter(Boolean)
        
        return searchFields.some(field => 
          field.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    
    if (statusFilter && statusFilter !== "all") {
      data = data.filter((item: any) => item.status === statusFilter)
    }
    
    return data
  }, [searchTerm, statusFilter, selectedNode, selectedLevel])

  const renderTreeNode = (node: TreeNode, level = 0) => (
    <div key={node.id} className="select-none">
      <div
        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent transition-colors ${
          selectedNode?.id === node.id ? 'bg-accent' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => selectNode(node)}
      >
        {node.children && node.children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation()
              toggleNode(node.id)
            }}
          >
            {node.expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        {!node.children && <div className="w-4" />}
        
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {node.type === 'warehouse' && <Warehouse className="h-4 w-4 text-blue-600 shrink-0" />}
          {node.type === 'zone' && <MapPin className="h-4 w-4 text-green-600 shrink-0" />}
          {node.type === 'location' && <Box className="h-4 w-4 text-orange-600 shrink-0" />}
          <div className="min-w-0 flex-1">
            <div className="text-sm truncate">{node.name}</div>
            <div className="text-xs text-muted-foreground">{node.code}</div>
          </div>
          <Badge 
            variant={node.status === 'Active' ? 'default' : 'secondary'}
            className="text-xs shrink-0"
          >
            {node.status}
          </Badge>
        </div>
      </div>
      
      {node.expanded && node.children && (
        <div>
          {node.children.map(child => renderTreeNode(child, level + 1))}
        </div>
      )}
    </div>
  )

  const handleCreate = (type: 'warehouse' | 'zone' | 'location') => {
    setEditingItem(null)
    if (type === 'warehouse') {
      setFormData({ status: "Active" })
    } else if (type === 'zone') {
      setFormData({ 
        warehouseCode: selectedNode?.type === 'warehouse' ? selectedNode.code : '',
        status: "Active" 
      })
    } else {
      setFormData({ 
        warehouseCode: selectedNode?.type === 'warehouse' ? selectedNode.code : 
                       selectedNode?.type === 'zone' ? selectedNode.data.warehouseCode : '',
        zoneCode: selectedNode?.type === 'zone' ? selectedNode.code : '',
        status: "Active" 
      })
    }
    setSelectedLevel(type)
    setIsDialogOpen(true)
  }

  const handleEdit = (item: any, type: 'warehouse' | 'zone' | 'location') => {
    setEditingItem(item)
    setSelectedLevel(type)
    if (type === 'warehouse') {
      setFormData({
        warehouseCode: item.warehouseCode,
        warehouseName: item.warehouseName,
        branchCode: item.branchCode,
        address: item.address,
        manager: item.manager,
        status: item.status
      })
    } else if (type === 'zone') {
      setFormData({
        zoneCode: item.zoneCode,
        zoneName: item.zoneName,
        warehouseCode: item.warehouseCode,
        status: item.status
      })
    } else {
      setFormData({
        binCode: item.binCode,
        binName: item.binName,
        zoneCode: item.zoneCode,
        warehouseCode: item.warehouseCode,
        capacity: item.capacity,
        status: item.status
      })
    }
    setIsDialogOpen(true)
  }

  const handleDoubleClick = (item: any, type?: 'warehouse' | 'zone' | 'location') => {
    const itemType = type || selectedLevel
    setDetailItem({ ...item, type: itemType })
    setIsDetailSheetOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedLevel === 'warehouse') {
      if (!formData.warehouseCode || !formData.warehouseName || !formData.branchCode || !formData.address || !formData.manager) {
        toast.error("Please fill in all required fields")
        return
      }
    } else if (selectedLevel === 'zone') {
      if (!formData.zoneCode || !formData.zoneName || !formData.warehouseCode) {
        toast.error("Please fill in all required fields")
        return
      }
    } else {
      if (!formData.binCode || !formData.binName || !formData.zoneCode || !formData.capacity) {
        toast.error("Please fill in all required fields")
        return
      }
    }

    const itemType = selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)
    if (editingItem) {
      toast.success(`${itemType} updated successfully`)
    } else {
      toast.success(`${itemType} created successfully`)
    }
    setIsDialogOpen(false)
  }

  const handleExport = () => {
    const dataToExport = activeTab === 'summary' ? filteredSummaryData : filteredDetailData
    toast.success(`Exporting ${dataToExport.length} records...`)
  }

  const getColumnVisibilityComponent = (columns: ColumnVisibility, setColumns: (cols: ColumnVisibility) => void, columnsConfig: Array<{key: string, label: string}>) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 bg-primary text-primary-foreground hover:bg-primary/90 border-primary">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnsConfig.map(col => (
          <DropdownMenuCheckboxItem
            key={col.key}
            checked={columns[col.key]}
            onCheckedChange={(checked) => 
              setColumns({ ...columns, [col.key]: checked })
            }
          >
            {col.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const getViewData = (item: any, type: 'warehouse' | 'zone' | 'location') => {
    if (type === 'warehouse') {
      return [
        { label: "Warehouse Code", value: item.warehouseCode },
        { label: "Warehouse Name", value: item.warehouseName },
        { 
          label: "Branch", 
          value: (
            <Card className="p-3 bg-muted/50">
              <div className="space-y-1">
                <p className="font-medium text-sm">{item.branchName}</p>
                <p className="text-xs text-muted-foreground">{item.branchCode}</p>
              </div>
            </Card>
          ),
          type: 'card' as const
        },
        { label: "Address", value: item.address },
        { label: "Manager", value: item.manager },
        { 
          label: "Status", 
          value: item.status, 
          type: 'badge' as const, 
          variant: item.status === 'Active' ? 'default' : 'secondary'
        }
      ]
    } else if (type === 'zone') {
      return [
        { label: "Zone Code", value: item.zoneCode },
        { label: "Zone Name", value: item.zoneName },
        { 
          label: "Warehouse", 
          value: (
            <Card className="p-3 bg-muted/50">
              <div className="space-y-1">
                <p className="font-medium text-sm">{item.warehouseName}</p>
                <p className="text-xs text-muted-foreground">{item.warehouseCode}</p>
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
        }
      ]
    } else {
      return [
        { label: "Bin Code", value: item.binCode },
        { label: "Bin Name", value: item.binName },
        { 
          label: "Location", 
          value: (
            <Card className="p-3 bg-muted/50">
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-sm">{item.warehouseName}</p>
                  <p className="text-xs text-muted-foreground">{item.warehouseCode}</p>
                </div>
                <div className="border-t pt-2">
                  <p className="font-medium text-sm">{item.zoneName}</p>
                  <p className="text-xs text-muted-foreground">{item.zoneCode}</p>
                </div>
              </div>
            </Card>
          ),
          type: 'card' as const
        },
        { label: "Capacity", value: item.capacity },
        { 
          label: "Status", 
          value: item.status, 
          type: 'badge' as const, 
          variant: item.status === 'Active' ? 'default' : 'secondary'
        }
      ]
    }
  }

  const treeData = buildTreeData()

  return (
    <div className="flex flex-1 flex-col h-full bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 pb-4 border-b bg-white dark:bg-background">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Warehouse Structure Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage warehouse hierarchy: Warehouse → Zone → Location</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => handleCreate('warehouse')} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="h-4 w-4" />
            Create Warehouse
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleCreate('zone')} className="gap-2" disabled={!selectedNode || selectedNode.type === 'location'}>
            <Plus className="h-4 w-4" />
            Create Zone
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleCreate('location')} className="gap-2" disabled={!selectedNode || selectedNode.type === 'location'}>
            <Plus className="h-4 w-4" />
            Create Location
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 p-6 pt-4 min-h-0">
        {/* Left Panel - Tree View */}
        <Card className="w-80 flex-shrink-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Warehouse className="h-5 w-5" />
              Warehouse Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 px-6 pb-6">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              <div className="space-y-1">
                {treeData.map(node => renderTreeNode(node))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Data Table with Tabs */}
        <Card className="flex-1 min-w-0">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CardTitle className="text-lg font-medium">Warehouse Data</CardTitle>
                {selectedNode && (
                  <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    Selected: {selectedNode.name}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'summary' | 'detail')} className="w-full">
              <div className="px-6 pb-0">
                <TabsList className="bg-muted/50 p-1 h-10 rounded-lg">
                  <TabsTrigger value="summary" className="text-sm font-medium px-4 py-2">Summary</TabsTrigger>
                  <TabsTrigger value="detail" className="text-sm font-medium px-4 py-2">Detail</TabsTrigger>
                </TabsList>
              </div>

              {/* Filter Bar */}
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-muted/20 border-b">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by Part Number, Part Type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-9 bg-background border-border/50"
                      />
                    </div>
                    <Select value={branchFilter} onValueChange={setBranchFilter}>
                      <SelectTrigger className="w-40 h-9 bg-background border-border/50">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All branches</SelectItem>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.code}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40 h-9 bg-background border-border/50">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    {activeTab === 'summary' && getColumnVisibilityComponent(
                      summaryColumns, 
                      setSummaryColumns,
                      [
                        { key: 'branch', label: 'Branch' },
                        { key: 'warehouseCode', label: 'Code' },
                        { key: 'warehouseName', label: 'Name' },
                        { key: 'totalZones', label: 'Total Zones' },
                        { key: 'totalLocations', label: 'Total Locations' },
                        { key: 'status', label: 'Status' }
                      ]
                    )}
                    {activeTab === 'detail' && selectedLevel === 'warehouse' && getColumnVisibilityComponent(
                      warehouseColumns,
                      setWarehouseColumns,
                      [
                        { key: 'code', label: 'Code' },
                        { key: 'name', label: 'Name' },
                        { key: 'branch', label: 'Branch' },
                        { key: 'address', label: 'Address' },
                        { key: 'manager', label: 'Manager' },
                        { key: 'status', label: 'Status' }
                      ]
                    )}
                    {activeTab === 'detail' && selectedLevel === 'zone' && getColumnVisibilityComponent(
                      zoneColumns,
                      setZoneColumns,
                      [
                        { key: 'code', label: 'Code' },
                        { key: 'name', label: 'Name' },
                        { key: 'warehouse', label: 'Warehouse' },
                        { key: 'status', label: 'Status' }
                      ]
                    )}
                    {activeTab === 'detail' && selectedLevel === 'location' && getColumnVisibilityComponent(
                      locationColumns,
                      setLocationColumns,
                      [
                        { key: 'binCode', label: 'Bin Code' },
                        { key: 'binName', label: 'Bin Name' },
                        { key: 'zone', label: 'Zone' },
                        { key: 'capacity', label: 'Capacity' },
                        { key: 'status', label: 'Status' }
                      ]
                    )}
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-9" onClick={handleExport}>
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              <TabsContent value="summary" className="mt-0 h-full">
                <div className="overflow-auto max-h-[calc(100vh-400px)]">
                  <Table className="relative">
                    <TableHeader className="sticky top-0 bg-white dark:bg-background z-10">
                      <TableRow className="border-b border-border/50 hover:bg-transparent">
                        {summaryColumns.branch && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Branch</TableHead>}
                        {summaryColumns.warehouseCode && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Warehouse Code</TableHead>}
                        {summaryColumns.warehouseName && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Warehouse Name</TableHead>}
                        {summaryColumns.totalZones && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20 text-center">Total Zones</TableHead>}
                        {summaryColumns.totalLocations && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20 text-center">Total Locations</TableHead>}
                        {summaryColumns.status && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Status</TableHead>}
                        <TableHead className="w-[60px] text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSummaryData.map((item) => (
                        <TableRow 
                          key={item.id} 
                          className="hover:bg-muted/40 cursor-pointer border-b border-border/30 h-14"
                          onDoubleClick={() => handleDoubleClick(item.data, 'warehouse')}
                        >
                          {summaryColumns.branch && <TableCell className="font-medium text-sm">{item.branch}</TableCell>}
                          {summaryColumns.warehouseCode && <TableCell className="font-medium text-sm text-primary">{item.warehouseCode}</TableCell>}
                          {summaryColumns.warehouseName && <TableCell className="text-sm">{item.warehouseName}</TableCell>}
                          {summaryColumns.totalZones && <TableCell className="text-center text-sm font-medium">{item.totalZones}</TableCell>}
                          {summaryColumns.totalLocations && <TableCell className="text-center text-sm font-medium">{item.totalLocations}</TableCell>}
                          {summaryColumns.status && (
                            <TableCell>
                              <Badge 
                                variant={item.status === 'Active' ? 'default' : 'secondary'}
                                className={`text-xs px-2 py-1 ${item.status === 'Active' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                }`}
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => {
                                  setViewingItem(item.data)
                                  setSelectedLevel('warehouse')
                                  setIsViewDialogOpen(true)
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(item.data, 'warehouse')}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
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
                </div>
              </TabsContent>

              <TabsContent value="detail" className="mt-0 h-full">
                <div className="overflow-auto max-h-[calc(100vh-400px)]">
                  <Table className="relative">
                    <TableHeader className="sticky top-0 bg-white dark:bg-background z-10">
                      <TableRow className="border-b border-border/50 hover:bg-transparent">
                        {selectedLevel === 'warehouse' && (
                          <>
                            {warehouseColumns.code && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Code</TableHead>}
                            {warehouseColumns.name && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Name</TableHead>}
                            {warehouseColumns.branch && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Branch</TableHead>}
                            {warehouseColumns.address && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Address</TableHead>}
                            {warehouseColumns.manager && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Manager</TableHead>}
                            {warehouseColumns.status && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Status</TableHead>}
                          </>
                        )}
                        {selectedLevel === 'zone' && (
                          <>
                            {zoneColumns.code && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Code</TableHead>}
                            {zoneColumns.name && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Name</TableHead>}
                            {zoneColumns.warehouse && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Warehouse</TableHead>}
                            {zoneColumns.status && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Status</TableHead>}
                          </>
                        )}
                        {selectedLevel === 'location' && (
                          <>
                            {locationColumns.binCode && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Bin Code</TableHead>}
                            {locationColumns.binName && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Bin Name</TableHead>}
                            {locationColumns.zone && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Zone</TableHead>}
                            {locationColumns.capacity && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Capacity</TableHead>}
                            {locationColumns.status && <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Status</TableHead>}
                          </>
                        )}
                        <TableHead className="w-[60px] text-xs font-medium text-muted-foreground uppercase tracking-wider h-12 bg-gray-50/50 dark:bg-muted/20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDetailData.map((item: any) => (
                        <TableRow 
                          key={item.id}
                          className="hover:bg-muted/40 cursor-pointer border-b border-border/30 h-14"
                          onDoubleClick={() => handleDoubleClick(item)}
                        >
                          {selectedLevel === 'warehouse' && (
                            <>
                              {warehouseColumns.code && <TableCell className="font-medium text-sm text-primary">{item.warehouseCode}</TableCell>}
                              {warehouseColumns.name && <TableCell className="text-sm">{item.warehouseName}</TableCell>}
                              {warehouseColumns.branch && <TableCell className="text-sm">{item.branchName}</TableCell>}
                              {warehouseColumns.address && <TableCell className="max-w-xs truncate text-sm">{item.address}</TableCell>}
                              {warehouseColumns.manager && <TableCell className="text-sm">{item.manager}</TableCell>}
                              {warehouseColumns.status && (
                                <TableCell>
                                  <Badge 
                                    variant={item.status === 'Active' ? 'default' : 'secondary'}
                                    className={`text-xs px-2 py-1 ${item.status === 'Active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                    }`}
                                  >
                                    {item.status}
                                  </Badge>
                                </TableCell>
                              )}
                            </>
                          )}
                          {selectedLevel === 'zone' && (
                            <>
                              {zoneColumns.code && <TableCell className="font-medium text-sm text-primary">{item.zoneCode}</TableCell>}
                              {zoneColumns.name && <TableCell className="text-sm">{item.zoneName}</TableCell>}
                              {zoneColumns.warehouse && <TableCell className="text-sm">{item.warehouseName}</TableCell>}
                              {zoneColumns.status && (
                                <TableCell>
                                  <Badge 
                                    variant={item.status === 'Active' ? 'default' : 'secondary'}
                                    className={`text-xs px-2 py-1 ${item.status === 'Active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                    }`}
                                  >
                                    {item.status}
                                  </Badge>
                                </TableCell>
                              )}
                            </>
                          )}
                          {selectedLevel === 'location' && (
                            <>
                              {locationColumns.binCode && <TableCell className="font-medium text-sm text-primary">{item.binCode}</TableCell>}
                              {locationColumns.binName && <TableCell className="text-sm">{item.binName}</TableCell>}
                              {locationColumns.zone && <TableCell className="text-sm">{item.zoneName}</TableCell>}
                              {locationColumns.capacity && <TableCell className="text-sm">{item.capacity}</TableCell>}
                              {locationColumns.status && (
                                <TableCell>
                                  <Badge 
                                    variant={item.status === 'Active' ? 'default' : 'secondary'}
                                    className={`text-xs px-2 py-1 ${item.status === 'Active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                    }`}
                                  >
                                    {item.status}
                                  </Badge>
                                </TableCell>
                              )}
                            </>
                          )}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => {
                                  setViewingItem(item)
                                  setIsViewDialogOpen(true)
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(item, selectedLevel)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
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
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem 
                ? `Edit ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}` 
                : `Create New ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}`
              }
            </DialogTitle>
            <DialogDescription>
              {editingItem 
                ? `Update the ${selectedLevel} information below.`
                : `Enter the details for the new ${selectedLevel}.`
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {selectedLevel === 'warehouse' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="warehouseCode" className="text-right">Code *</Label>
                    <Input
                      id="warehouseCode"
                      value={formData.warehouseCode || ''}
                      onChange={(e) => setFormData({ ...formData, warehouseCode: e.target.value.toUpperCase() })}
                      className="col-span-3"
                      placeholder="e.g., WH-001"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="warehouseName" className="text-right">Name *</Label>
                    <Input
                      id="warehouseName"
                      value={formData.warehouseName || ''}
                      onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                      className="col-span-3"
                      placeholder="Warehouse name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="branch" className="text-right">Branch *</Label>
                    <Select
                      value={formData.branchCode}
                      onValueChange={(value) => setFormData({ ...formData, branchCode: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.filter(b => b.status === 'Active').map(branch => (
                          <SelectItem key={branch.id} value={branch.code}>
                            {branch.name} ({branch.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="col-span-3"
                      placeholder="Full address"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="manager" className="text-right">Manager *</Label>
                    <Input
                      id="manager"
                      value={formData.manager || ''}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                      className="col-span-3"
                      placeholder="Manager name"
                      required
                    />
                  </div>
                </>
              )}

              {selectedLevel === 'zone' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zoneCode" className="text-right">Code *</Label>
                    <Input
                      id="zoneCode"
                      value={formData.zoneCode || ''}
                      onChange={(e) => setFormData({ ...formData, zoneCode: e.target.value.toUpperCase() })}
                      className="col-span-3"
                      placeholder="e.g., A"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zoneName" className="text-right">Name *</Label>
                    <Input
                      id="zoneName"
                      value={formData.zoneName || ''}
                      onChange={(e) => setFormData({ ...formData, zoneName: e.target.value })}
                      className="col-span-3"
                      placeholder="Zone name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="warehouse" className="text-right">Warehouse *</Label>
                    <Select
                      value={formData.warehouseCode}
                      onValueChange={(value) => setFormData({ ...formData, warehouseCode: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses.filter(w => w.status === 'Active').map(warehouse => (
                          <SelectItem key={warehouse.id} value={warehouse.warehouseCode}>
                            {warehouse.warehouseName} ({warehouse.warehouseCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedLevel === 'location' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="binCode" className="text-right">Code *</Label>
                    <Input
                      id="binCode"
                      value={formData.binCode || ''}
                      onChange={(e) => setFormData({ ...formData, binCode: e.target.value.toUpperCase() })}
                      className="col-span-3"
                      placeholder="e.g., A-01-01"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="binName" className="text-right">Name *</Label>
                    <Input
                      id="binName"
                      value={formData.binName || ''}
                      onChange={(e) => setFormData({ ...formData, binName: e.target.value })}
                      className="col-span-3"
                      placeholder="Location name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zone" className="text-right">Zone *</Label>
                    <Select
                      value={formData.zoneCode}
                      onValueChange={(value) => setFormData({ ...formData, zoneCode: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {warehouses
                          .filter(w => w.warehouseCode === formData.warehouseCode)
                          .flatMap(w => w.zones)
                          .filter(z => z.status === 'Active')
                          .map(zone => (
                            <SelectItem key={zone.id} value={zone.zoneCode}>
                              {zone.zoneName} ({zone.zoneCode})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">Capacity *</Label>
                    <Input
                      id="capacity"
                      value={formData.capacity || ''}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 100 units"
                      required
                    />
                  </div>
                </>
              )}

              {editingItem && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
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
          title={`${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}: ${
            selectedLevel === 'warehouse' ? viewingItem.warehouseName :
            selectedLevel === 'zone' ? viewingItem.zoneName :
            viewingItem.binName
          }`}
          data={getViewData(viewingItem, selectedLevel)}
          onEdit={() => {
            setIsViewDialogOpen(false)
            handleEdit(viewingItem, selectedLevel)
          }}
        />
      )}

      {/* Detail Sheet for Double-Click */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent className="w-[600px] sm:w-[540px]">
          {detailItem && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {detailItem.type === 'warehouse' && <Warehouse className="h-5 w-5" />}
                  {detailItem.type === 'zone' && <MapPin className="h-5 w-5" />}
                  {detailItem.type === 'location' && <Box className="h-5 w-5" />}
                  {detailItem.type === 'warehouse' ? detailItem.warehouseName :
                   detailItem.type === 'zone' ? detailItem.zoneName :
                   detailItem.binName}
                </SheetTitle>
                <SheetDescription>
                  Detailed information and last update history
                </SheetDescription>
              </SheetHeader>
              
              <div className="grid gap-6 py-4">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {detailItem.type === 'warehouse' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Code</Label>
                            <p className="text-sm mt-1">{detailItem.warehouseCode}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                            <p className="text-sm mt-1">{detailItem.warehouseName}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Branch</Label>
                            <p className="text-sm mt-1">{detailItem.branchName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Manager</Label>
                            <p className="text-sm mt-1">{detailItem.manager}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                          <p className="text-sm mt-1">{detailItem.address}</p>
                        </div>
                      </>
                    )}
                    
                    {detailItem.type === 'zone' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Zone Code</Label>
                            <p className="text-sm mt-1">{detailItem.zoneCode}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Zone Name</Label>
                            <p className="text-sm mt-1">{detailItem.zoneName}</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Warehouse</Label>
                          <p className="text-sm mt-1">{detailItem.warehouseName} ({detailItem.warehouseCode})</p>
                        </div>
                      </>
                    )}
                    
                    {detailItem.type === 'location' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Bin Code</Label>
                            <p className="text-sm mt-1">{detailItem.binCode}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Bin Name</Label>
                            <p className="text-sm mt-1">{detailItem.binName}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Zone</Label>
                            <p className="text-sm mt-1">{detailItem.zoneName} ({detailItem.zoneCode})</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Capacity</Label>
                            <p className="text-sm mt-1">{detailItem.capacity}</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        <Badge variant={detailItem.status === 'Active' ? 'default' : 'secondary'}>
                          {detailItem.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Last Update Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Update
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span className="text-sm">{detailItem.lastUpdated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">By:</span>
                      <span className="text-sm">{detailItem.updatedBy}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => {
                      setIsDetailSheetOpen(false)
                      handleEdit(detailItem, detailItem.type)
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit {detailItem.type}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsDetailSheetOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}