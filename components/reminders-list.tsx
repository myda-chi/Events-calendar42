"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDate } from "@/lib/utils"
import { getAllReminders, removeReminder, type EventReminder } from "@/lib/reminder-service"
import { useToast } from "@/hooks/use-toast"

export default function RemindersList() {
  const [reminders, setReminders] = useState<EventReminder[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Load reminders when dialog opens
  useEffect(() => {
    if (isOpen) {
      setReminders(getAllReminders())
    }
  }, [isOpen])

  const handleRemoveReminder = (eventId: string, eventTitle: string) => {
    const removed = removeReminder(eventId)

    if (removed) {
      setReminders(reminders.filter((reminder) => reminder.eventId !== eventId))
      toast({
        title: "Reminder removed",
        description: `Reminder for "${eventTitle}" has been removed.`,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {reminders.length > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent" />}
          <span className="sr-only">View reminders</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Event Reminders</DialogTitle>
          <DialogDescription>Manage reminders for upcoming events.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72 mt-4">
          {reminders.length > 0 ? (
            <div className="space-y-4">
              {reminders.map((reminder) => {
                const eventDate = new Date(reminder.eventDate)
                const reminderTime = new Date(reminder.reminderTime)

                return (
                  <div key={reminder.eventId} className="flex items-start justify-between border-b pb-3">
                    <div>
                      <Link href={`/events/${reminder.eventId}`} className="font-medium hover:text-accent">
                        {reminder.eventTitle}
                      </Link>
                      <div className="text-sm text-muted-foreground">Event: {formatDate(reminder.eventDate)}</div>
                      <div className="text-sm text-muted-foreground">Reminder: {reminderTime.toLocaleString()}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveReminder(reminder.eventId, reminder.eventTitle)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove reminder</span>
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">You don't have any active reminders.</div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
