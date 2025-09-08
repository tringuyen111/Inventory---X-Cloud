import * as React from "react"

import { WarehouseSidebar } from "./components/warehouse-sidebar"
import { TopBar } from "./components/top-bar"
import { DashboardContent } from "./components/dashboard-content"
import { AssetTypeManagement } from "./components/asset-type-management"
import { ModelAssetManagement } from "./components/model-asset-management"
import { AssetListManagement } from "./components/asset-list-management"
import { OrganizationManagement } from "./components/organization-management"
import { WarehouseStructureManagement } from "./components/warehouse-structure-management"
import { PartnerManagement } from "./components/partner-management"
import { UnitOfMeasureManagement } from "./components/unit-of-measure-management"
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar"
import { Toaster } from "./components/ui/sonner"

export default function App() {
  const [isDark, setIsDark] = React.useState(false)
  const [currentView, setCurrentView] = React.useState("dashboard")

  React.useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    }

    // Handle navigation from sidebar clicks
    const handleNavigation = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail?.view) {
        setCurrentView(customEvent.detail.view)
      }
    }

    window.addEventListener('navigate', handleNavigation)
    return () => window.removeEventListener('navigate', handleNavigation)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case "asset-type":
        return <AssetTypeManagement />
      case "model-asset":
        return <ModelAssetManagement />
      case "asset-list":
        return <AssetListManagement />
      case "organization":
        return <OrganizationManagement />
      case "warehouse":
        return <WarehouseStructureManagement />
      case "partner":
        return <PartnerManagement />
      case "unit-of-measure":
        return <UnitOfMeasureManagement />
      default:
        return <DashboardContent />
    }
  }

  return (
    <SidebarProvider>
      <WarehouseSidebar onNavigate={setCurrentView} />
      <SidebarInset>
        <TopBar onThemeToggle={toggleTheme} isDark={isDark} />
        {renderContent()}
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}