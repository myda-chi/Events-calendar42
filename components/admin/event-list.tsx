"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getAllEventsFromStorage, deleteEventFromStorage, initializeEvents } from "@/lib/client-storage"
import type { Event } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminEventList({ filter }: { filter: "all" | "upcoming" | "past" | "draft" }) {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [isClient, setIsClient] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Load events from localStorage
  useEffect(() => {
    setIsClient(true)
    // Initialize events if needed
    initializeEvents()
    const storedEvents = getAllEventsFromStorage()
    setEvents(storedEvents)
  }, [])

  // Filter events based on the selected tab
  const filteredEvents = events.filter((event) => {
    // Apply search filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    const now = new Date()
    const eventDate = new Date(event.startDate)

    // Apply tab filter
    switch (filter) {
      case "upcoming":
        return eventDate > now && event.isPublished
      case "past":
        return eventDate < now && event.isPublished
      case "draft":
        return !event.isPublished
      default:
        return true
    }
  })

  const openDeleteDialog = (eventId: string) => {
    setEventToDelete(eventId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteEvent = () => {
    if (!eventToDelete) return

    try {
      // Delete from localStorage
      deleteEventFromStorage(eventToDelete)

      // Update the UI
      setEvents(events.filter((event) => event.id !== eventToDelete))

      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Close the dialog and reset the eventToDelete
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
    }
  }

  if (!isClient) {
    return <div>Loading events...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm bg-background/40"
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border/20 bg-background/20">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-background/40">
              <TableHead>Event</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-background/40">
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{formatDate(event.startDate)}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    {!event.isPublished ? (
                      <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                        Draft
                      </Badge>
                    ) : new Date(event.startDate) > new Date() ? (
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Upcoming
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground border-muted-foreground">
                        Past
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {event.attendees}/{event.capacity}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card">
                        <DropdownMenuItem asChild>
                          <Link href={`/events/${event.id}`} className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/events/${event.id}/edit`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault()
                            openDeleteDialog(event.id)
                          }}
                          className="flex items-center text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Separate Alert Dialog for deletion */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background/40">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
