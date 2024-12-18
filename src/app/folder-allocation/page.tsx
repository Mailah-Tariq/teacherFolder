import { Header } from "../component1/header"
import { Sidebar } from "../component1/sidebar"
import { FolderAllocation } from "../component1/folder-allocation"

export default function FolderAllocationPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <FolderAllocation />
      </div>
    </div>
  )
}

