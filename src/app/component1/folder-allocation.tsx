"use client";
import { useEffect, useState } from "react"
import { Bell, FolderPlus, FolderMinus } from "lucide-react"

import { Button } from "../components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Toast } from "../components/ui/toast"

interface Student {
  id: number
  name: string
}
interface Course {
  title: string;
  href: string;
}
// Define the FolderAllocationProps to accept a course prop
interface FolderAllocationProps {
  course: Course;  // Use the course type here
}

interface Program {
  Title: string
  ShortName: string
}

interface Teacher {
  Id: number
  Name: string
  ProgramShortName: string
  ProgramTitle: string
  IsActive: boolean
}

const students: Student[] = [
  { id: 1, name: "Ali Bin Tahir" },
  { id: 2, name: "John Doe" },
  { id: 3, name: "Jane Smith" }
]

const programs: Program[] = [
  { Title: "Bachelor of Computer Science", ShortName: "BCS" },
  { Title: "Bachelor of Information Technology", ShortName: "BAI" },
  { Title: "Bachelor of Software Engineering", ShortName: "BSE" }
]

export function FolderAllocation({ course }: FolderAllocationProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [allocatedFolders, setAllocatedFolders] = useState<number[]>([])
  const [selectedProgramShortName, setSelectedProgramShortName] = useState<string>("BCS")
  const [selectedProgramTitle, setSelectedProgramTitle] = useState<string>("Bachelor of Computer Science")
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const courseId = 30  // Example courseId, make sure it's dynamic or passed in

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`https://localhost:44338/api/hod/TeachersForCourse?courseId=${courseId}`)
        const data = await response.json()
        setTeachers(data)
      } catch (error) {
        console.error("Error fetching teachers:", error)
      }
    }

    fetchTeachers()
  }, [courseId])

  // Handle Delete Folder Allocation
  const handleDeleteFolder = (studentId: number) => {
    const allocationId = 3771 // Static allocation ID for this example

    // Update local state to reflect deletion
    setAllocatedFolders(prevAllocated =>
      prevAllocated.filter(id => id !== allocationId)
    )

    // Show success toast
    setToastMessage("Folder allocation successfully removed")
    setShowToast(true)
  }

  // Handle Program Selection
  const handleProgramChange = (shortName: string) => {
    setSelectedProgramShortName(shortName)
    const selectedProgram = programs.find((program) => program.ShortName === shortName)
    setSelectedProgramTitle(selectedProgram?.Title || "")
  }

  return (
    <div className="p-6">
      {showToast && (
        <Toast
          title="Success"
          description={toastMessage}
          className="absolute top-4 right-4"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Main Folder Allocation for {course.title}</h2>
          <div className="flex items-center gap-4">
            {/* Program Dropdown */}
            <Select value={selectedProgramShortName} onValueChange={handleProgramChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.ShortName} value={program.ShortName}>
                    {program.ShortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Teacher ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => {
              const isAllocated = allocatedFolders.includes(teacher.Id)
              return (
                <TableRow key={teacher.Id}>
                  <TableCell>{teacher.Id}</TableCell>
                  <TableCell>{teacher.Name}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteFolder(teacher.Id)}
                      className={`h-8 w-8 p-0 ${
                        isAllocated ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {isAllocated ? (
                        <FolderMinus className="h-4 w-4" />
                      ) : (
                        <FolderPlus className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {isAllocated ? "Remove folder" : "Allocate folder"}
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
