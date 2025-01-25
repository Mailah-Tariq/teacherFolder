import { GraduationCap, LayoutDashboard, CheckCircle, FolderClosed, FolderOpen, BookOpen } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 min-h-screen bg-emerald-600 text-white", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2 flex flex-col items-center">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Dr. Munir Ahmed"
            width={80}
            height={80}
            className="rounded-full bg-white mb-2"
          />
          <h2 className="text-lg font-semibold text-center">Dr. Munir Ahmed</h2>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-emerald-700">
              <Link href="/hodDashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-emerald-700">
              <Link href="/plos">
                <GraduationCap className="mr-2 h-4 w-4" />
                PLOs
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-emerald-700">
              <Link href="/folder-allocation">
                <CheckCircle className="mr-2 h-4 w-4" />
                folder allocation
              </Link>
            </Button>
           
            <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-emerald-700">
              <Link href="/folder">
                <FolderClosed className="mr-2 h-4 w-4" />
                Check Folders
              </Link>
            </Button>
            {/* <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-emerald-700">
              <Link href="#">
                <FolderOpen className="mr-2 h-4 w-4" />
                Incompleted Folders
              </Link>
            </Button> */}
          
          </div>
        </div>
      </div>
    </div>
  )
}

