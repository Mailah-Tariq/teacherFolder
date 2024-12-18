'use client'

import { useState } from 'react'
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (response: any) => void // Callback to pass response to parent
}

export function UploadDialog({ isOpen, onClose, onUploadSuccess }: UploadDialogProps) {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      alert("Please select a file to upload.")
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("CourseInSOSId", "18")
      formData.append("FolderCheckListId", "7")
      formData.append("DisplayName", title)
      formData.append("file", file)

      const response = await fetch("https://localhost:44338/api/folder/UploadFolderContent", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const responseData = await response.json()
        alert("File uploaded successfully!")
        console.log("Upload Response:", responseData)
        onUploadSuccess(responseData) // Pass response to parent component
      } else {
        alert("Failed to upload the file.")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("An error occurred while uploading the file.")
    } finally {
      setIsUploading(false)
      setTitle('')
      setFile(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file:bg-emerald-600 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2 file:hover:bg-emerald-700 cursor-pointer"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}