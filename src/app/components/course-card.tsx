import { Card, CardContent, CardHeader } from "../components/ui/card"
import { ChevronRight } from 'lucide-react'
import Link from "next/link"

interface CourseCardProps {
  code: string
  title: string
  semester: number
  program: string
}

export function CourseCard({ code, title, semester, program }: CourseCardProps) {
  return (
    <Link href={`/dashboard/${code ? code.toLowerCase() : ''}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{code}</h3>
              <p className="text-gray-500">{title}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-gray-600">Semester: {semester}</p>
          <p className="text-sm text-gray-600">Program: {program}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

