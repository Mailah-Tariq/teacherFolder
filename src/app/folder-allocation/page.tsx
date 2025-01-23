import { Header } from "../component1/header"
import { Sidebar } from "../component1/sidebar"
import { FolderAllocation } from "../component1/folder-allocation"

// Define the structure of the course object
interface Course {
  title: string;
  href: string;
}

export default function FolderAllocationPage() {
  // Example course data - replace this with dynamic data as needed
  const course: Course = {
    title: "Bachelor of Computer Science",
    href: "#",  // Placeholder link, update as needed
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        {/* Pass the course object as a prop */}
        <FolderAllocation course={course} />
      </div>
    </div>
  )
}
