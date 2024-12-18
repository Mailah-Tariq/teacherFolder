import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from "../components/ui/card"
import Link from "next/link"

interface CourseSectionProps {
  icon: React.ReactNode
  title: string
  courseInSoSId:number 
  // courseId: string
  view: string
}

export function CourseSection({ icon, title, courseInSoSId, view }: CourseSectionProps) {
  return (
    <Link href={`/dashboard/${courseInSoSId}/${view}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon}
              <span className="font-medium">{title}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

