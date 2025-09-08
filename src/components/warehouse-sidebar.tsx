import * as React from "react"
import {
  BarChart3,
  Building2,
  ChevronRight,
  Database,
  FileText,
  Home,
  MapPin,
  Package,
  PackageCheck,
  PackageOpen,
  PackagePlus,
  Repeat,
  Scale,
  Settings,
  Truck,
  Users,
  Warehouse,
} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboards",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Warehouse Operations",
      url: "#",
      icon: Warehouse,
      items: [
        {
          title: "Inventory (Kiểm Kê)",
          url: "/inventory",
          icon: Package,
        },
        {
          title: "Goods Receipt (Nhập kho)",
          url: "/goods-receipt",
          icon: PackagePlus,
        },
        {
          title: "Goods Issue (Xuất kho)",
          url: "/goods-issue",
          icon: PackageOpen,
        },
        {
          title: "Goods Transfer (Chuyển kho/Nội bộ)",
          url: "/goods-transfer",
          icon: Repeat,
        },
      ],
    },
    {
      title: "Asset Management",
      url: "#",
      icon: PackageCheck,
      items: [
        {
          title: "Asset Type",
          url: "/asset-type",
        },
        {
          title: "Model Asset",
          url: "/model-asset",
        },
        {
          title: "Asset List",
          url: "/asset-list",
        },
      ],
    },
    {
      title: "Master Data (Catalog)",
      url: "#",
      icon: Database,
      items: [
        {
          title: "Organization (Tổ chức)",
          url: "/organization",
          icon: Building2,
        },
        {
          title: "Warehouse (Kho hàng)",
          url: "/warehouse",
          icon: Warehouse,
        },
        {
          title: "Location Bin/Slot (Vị trí)",
          url: "/location",
          icon: MapPin,
        },
        {
          title: "Unit of Measure (UoM)",
          url: "/unit-of-measure",
          icon: Scale,
        },
        {
          title: "Partner (Customer/Supplier)",
          url: "/partner",
          icon: Users,
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Stock In/Out Report (Báo cáo nhập xuất tồn)",
          url: "/report-stock-inout",
        },
        {
          title: "Report by Warehouse/Branch",
          url: "/report-warehouse-branch",
        },
        {
          title: "Report by Asset Type / Model",
          url: "/report-asset-type-model",
        },
      ],
    },
    {
      title: "Admin",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Authentication / Users & Roles",
          url: "/admin-auth",
          icon: Users,
        },
        {
          title: "System Config",
          url: "/admin-config",
          icon: Settings,
        },
      ],
    },
  ],
}

interface WarehouseSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onNavigate?: (view: string) => void
}

export function WarehouseSidebar({ onNavigate, ...props }: WarehouseSidebarProps) {
  const handleNavigation = (url: string) => {
    const viewMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/asset-type': 'asset-type',
      '/model-asset': 'model-asset', 
      '/asset-list': 'asset-list',
      '/organization': 'organization',
      '/warehouse': 'warehouse',
      '/partner': 'partner',
      '/unit-of-measure': 'unit-of-measure'
    }
    
    if (onNavigate && viewMap[url]) {
      onNavigate(viewMap[url])
    }
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Warehouse Management System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        onClick={() => !item.items && handleNavigation(item.url)}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.items && (
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton onClick={() => handleNavigation(subItem.url)}>
                                {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}