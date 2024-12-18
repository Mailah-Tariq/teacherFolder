"use client"

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

interface Program {
  Title: string
  ShortName: string
}

interface TeacherResponse {
  Teacherid: string
  TeacherName: string
}

const students: Student[] = [
  { id: 0, name: "Ali Bin Tahir" },
]

export function FolderAllocation() {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [allocatedFolders, setAllocatedFolders] = useState<number[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [selectedProgramShortName, setSelectedProgramShortName] = useState<string>("")
  const [selectedProgramTitle, setSelectedProgramTitle] = useState<string>("")
  const [courseName, setCourseName] = useState("Loading...")
  const [teacherName, setTeacherName] = useState<string>("")
  const [teacherid, setTeacherid] = useState<string>("")

  const courseCode = "CSC-103" // Static or dynamic course code
  const courseId = "30"

  // Fetch Course Name
  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const response = await fetch(
          `https://localhost:44338/api/hod/GetCourseNameByCourseCode?courseCode=${courseCode}`
        )
        const data = await response.json()
        setCourseName(data.title)
      } catch (error) {
        console.error("Failed to fetch course name:", error)
      }
    }
    fetchCourseName()
  }, [courseCode])

  // Fetch Programs based on Course Code
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(
          `https://localhost:44338/api/hod/GetProgramsByCourseCode?courseCode=${courseCode}`
        )
        const data: Program[] = await response.json()
        setPrograms(data)
        if (data.length > 0) {
          setSelectedProgramShortName(data[0].ShortName)
          setSelectedProgramTitle(data[0].Title)
        }
      } catch (error) {
        console.error("Failed to fetch programs:", error)
      }
    }
    fetchPrograms()
  }, [courseCode])

  // Fetch Teacher Name based on Program and Course
  useEffect(() => {
    const fetchTeacherName = async () => {
      if (courseId) {
        try {
          const response = await fetch(
            `https://localhost:44338/api/hod/GetAssignedFoldersForTeacher?programId=3&courseId=${courseId}`
          )
          const data: TeacherResponse[] = await response.json()
          setTeacherName(data[0].TeacherName || "No teacher assigned")
          setTeacherid(data[0].Teacherid || "No teacher id assigned")

        } catch (error) {
          console.error("Failed to fetch teacher name:", error)
          setTeacherName("Teacher information unavailable")
        }
      }
    }
    fetchTeacherName()
  }, [courseId])

  // Handle Delete Folder Allocation
  const handleDeleteFolder = async () => {
    // Use the AllocationId you provided
    const allocationId = 3771 // Static allocation ID from your example

    try {
      const response = await fetch(
        `https://localhost:44338/api/hod/DeleteAssignedFolders?allocationId=${allocationId}`, 
        {
          method: 'DELETE'
        }
      )

      if (response.ok) {
        // Update local state to reflect deletion
        setAllocatedFolders(prevAllocated => 
          prevAllocated.filter(id => id !== allocationId)
        )

        // Show success toast
        setToastMessage("Folder allocation successfully removed")
        setShowToast(true)
      } else {
        // Handle error scenario
        setToastMessage("Failed to remove folder allocation")
        setShowToast(true)
      }
    } catch (error) {
      console.error("Error deleting folder allocation:", error)
      setToastMessage("An error occurred while removing folder allocation")
      setShowToast(true)
    }
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
          <h2 className="text-2xl font-semibold mb-2">Main Folder Allocation</h2>
          <div className="flex items-center gap-4">
            {/* Course Label */}
            <div className="space-y-1">
              <label className="font-semibold">Course:</label>
              <span>
                {courseName} ({selectedProgramTitle})
              </span>
            </div>
            
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
        <Button variant="outline" onClick={() => setShowToast(true)}>
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const isAllocated = allocatedFolders.includes(student.id)
              return (
                <TableRow key={student.id}>
                  <TableCell>{teacherid}</TableCell>
                  <TableCell>{teacherName}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDeleteFolder}
                      className={`h-8 w-8 p-0 ${
                        isAllocated 
                          ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                          : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
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