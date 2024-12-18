

"use client"

import { useState, useEffect } from "react"
import { Header } from "../component1/header"
import { Sidebar } from "../component1/sidebar"
import { PLOTable } from "../component1/plo-table"
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

// API URL
const API_URL = "https://localhost:44338/api/hod/TeachersForCourse?courseId=30"

export default function PLOs() {
  const [selectedProgram, setSelectedProgram] = useState<string>("BCS") // Default selected program
  const [filteredData, setFilteredData] = useState<any[]>([]) // State to store filtered API data

  // Fetch data from API when the selected program changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()

        // Filter data based on the selected program
        const filtered = data.filter((item: any) => item.ProgramShortName === selectedProgram)
        setFilteredData(filtered)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [selectedProgram]) // Re-run whenever selectedProgram changes

  // Handle program selection from the dropdown
  const handleProgramSelect = (program: string) => {
    setSelectedProgram(program)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">PLOs</h2>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {selectedProgram}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleProgramSelect("BCS")}>BCS</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProgramSelect("BAI")}>BAI</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProgramSelect("BSE")}>BSE</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table to display filtered data */}
          <div className="rounded-lg border bg-white">
            <PLOTable plos={filteredData.map(item => ({
              id: item.Id,
              title: item.Name,
              description: item.ProgramTitle
            }))} />
          </div>
        </main>
      </div>
    </div>
  )
}