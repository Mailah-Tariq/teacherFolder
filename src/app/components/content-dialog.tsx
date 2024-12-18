'use client'

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { FileIcon } from "lucide-react"

interface ContentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContentDialog({ open, onOpenChange }: ContentDialogProps) {
  const [contents, setContents] = useState<{ id: number; name: string; filePath: string }[]>([])

  // Fetch the data from API
  useEffect(() => {
    async function fetchContents() {
      try {
        const response = await fetch(
          "https://localhost:44338/api/teacher/GetLectureFiles?courseId=30&checkListId=7"
        )
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = await response.json()

        // Format the data to match the required structure
        const formattedContents = data.map((item: any, index: number) => ({
          id: index, // You can replace this with an actual ID if provided
          name: item.DisplayName,
          filePath: item.FilePath,
        }))

        setContents(formattedContents)
      } catch (error) {
        console.error(error)
      }
    }

    if (open) {
      fetchContents()
    }
  }, [open]) // Trigger the fetch when the dialog opens

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Content Detail</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Document</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content.id}>
                <TableCell>{content.id}</TableCell>
                <TableCell>{content.name}</TableCell>
                <TableCell>
                  {content.filePath && (
                    <a href={`https://localhost:44338/api/teacher/download?filePath=${content.filePath}`} target="_blank" rel="noopener noreferrer">
                      <FileIcon className="h-4 w-4 text-blue-500" />
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="text-sm text-muted-foreground">1 row selected</div>
      </DialogContent>
    </Dialog>
  )
}
