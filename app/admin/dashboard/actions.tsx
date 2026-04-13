"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}

export function DeleteBlogButton({ blogId }: { blogId: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    const res = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" })

    if (!res.ok) {
      const data = await res.json()
      alert("Error deleting blog post: " + (data.error || "Unknown error"))
      setIsDeleting(false)
      return
    }

    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  )
}

export function UpdateEnquiryStatus({ id, currentStatus }: { id: string, currentStatus: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true)
    const newStatus = e.target.value

    const res = await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })

    if (!res.ok) {
      alert("Failed to update status")
    }

    setIsLoading(false)
    router.refresh()
  }

  return (
    <select 
      value={currentStatus} 
      onChange={handleStatusChange}
      disabled={isLoading}
      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </select>
  )
}

export function UpdateContactStatus({ id, currentStatus }: { id: string, currentStatus: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true)
    const newStatus = e.target.value

    const res = await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    })

    if (!res.ok) {
      alert("Failed to update status")
    }

    setIsLoading(false)
    router.refresh()
  }

  return (
    <select 
      value={currentStatus} 
      onChange={handleStatusChange}
      disabled={isLoading}
      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
    >
      <option value="new">New</option>
      <option value="read">Read</option>
      <option value="replied">Replied</option>
    </select>
  )
}

