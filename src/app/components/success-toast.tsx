'use client'

import { X } from 'lucide-react'
import { Button } from "../components/ui/button"
import { useEffect, useState } from "react"

export function SuccessToast() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed right-4 top-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-emerald-700">
      <span>✓</span>
      <span>Content uploaded successfully</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 hover:bg-transparent"
        onClick={() => setShow(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

