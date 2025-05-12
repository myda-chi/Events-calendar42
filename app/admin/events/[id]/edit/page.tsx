"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import EventForm from "@/components/admin/event-form"
import { getEventById } from "@/lib/data"
import type { Event } from "@/lib/types"

interface EditEventPageProps {
  params: {
    id: string
  }
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadEvent() {
      try {
        const eventData = await getEventById(params.id)
        if (eventData) {
          setEvent(eventData)
        }
      } catch (error) {
        console.error("Error loading event:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container px-4 py-10 mx-auto">
        <div className="glass-card p-8 rounded-xl">
          <div className="text-center">Loading event data...</div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container px-4 py-10 mx-auto">
        <div className="glass-card p-8 rounded-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="mb-4">The event you're trying to edit doesn't exist.</p>
            <Button asChild>
              <Link href="/admin">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-10 mx-auto">
      <div className="glass-card p-8 rounded-xl">
        <div className="flex items-center mb-8">
          <Button asChild variant="ghost" size="sm" className="mr-4">
            <Link href="/admin">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
            <p className="text-muted-foreground mt-1">Update event details</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <EventForm existingEvent={event} />
        </div>
      </div>
    </div>
  )
}
