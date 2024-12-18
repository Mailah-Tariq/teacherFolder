import { Header } from "../components/header"
import { Sidebar } from "../components/sidebar"
import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Download, Eye } from 'lucide-react'
const resources = [
  { id: 0, name: "Assignment" },
  { id: 1, name: "Quizes" },
  { id: 2, name: "Samples" },
  { id: 3, name: "Exam" },
  { id: 4, name: "Attendance" },
  { id: 5, name: "FCR" },
  { id: 6, name: "Solutions" },
  { id: 7, name: "Marks_Distribution_Grading" },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="flex justify-end mb-6">
          <Button className="bg-emerald-600 hover:bg-emerald-700">View Topics</Button>
        </div>
        <div className="bg-gray rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>{resource.id}</TableCell>
                  <TableCell>{resource.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      </div>
  
  )
}

