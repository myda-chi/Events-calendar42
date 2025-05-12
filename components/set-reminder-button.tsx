"use client"

import { useState } from "react"
import { Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { addReminder, removeReminder, hasReminder } from "@/lib/reminder-service"
import { useNotifications } from "@/components/notification-provider"
import type { Event } from "@/lib/types"

interface SetReminderButtonProps {
  event: Event
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function SetReminderButton({ event, variant = "outline", size = "icon" }: SetReminderButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reminderOffset, setReminderOffset] = useState("30") // Default 30 minutes
  const [hasActiveReminder, setHasActiveReminder] = useState(() => hasReminder(event.id))
  const { toast } = useToast()
  const { checkNotifications } = useNotifications()

  const handleSetReminder = () => {
    const offsetMinutes = Number.parseInt(reminderOffset, 10)
    const reminder = addReminder(event, offsetMinutes)

    if (reminder) {
      toast({
        title: "Reminder set",
        description: `You'll be reminded ${reminderOffset} minutes before "${event.title}" starts.`,
      })
      setHasActiveReminder(true)
      checkNotifications() // Check if the reminder is due immediately
    } else {
      toast({
        title: "Couldn't set reminder",
        description: "The event might be in the past or too soon.",
        variant: "destructive",
      })
    }

    setIsOpen(false)
  }

  const handleRemoveReminder = () => {
    const removed = removeReminder(event.id)

    if (removed) {
      toast({
        title: "Reminder removed",
        description: `Reminder for "${event.title}" has been removed.`,
      })
      setHasActiveReminder(false)
    }
  }

  return (
    <>
      {hasActiveReminder ? (
        <Button variant={variant} size={size} onClick={handleRemoveReminder} title="Remove reminder">
          <BellOff className="h-4 w-4" />
          <span className="sr-only">Remove reminder</span>
        </Button>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={variant} size={size} title="Set reminder">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Set reminder</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set Event Reminder</DialogTitle>
              <DialogDescription>Choose when you'd like to be reminded about "{event.title}".</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup value={reminderOffset} onValueChange={setReminderOffset}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="10" id="r1" />
                  <Label htmlFor="r1">10 minutes before</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="30" id="r2" />
                  <Label htmlFor="r2">30 minutes before</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="60" id="r3" />
                  <Label htmlFor="r3">1 hour before</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="1440" id="r4" />
                  <Label htmlFor="r4">1 day before</Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button onClick={handleSetReminder}>Set Reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
