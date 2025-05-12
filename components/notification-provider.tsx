"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { getDueReminders, markReminderAsNotified } from "@/lib/reminder-service"

interface NotificationContextType {
  checkNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  // Function to check for due notifications
  const checkNotifications = () => {
    const dueReminders = getDueReminders()

    dueReminders.forEach((reminder) => {
      // Show toast notification
      toast({
        title: "Event Reminder",
        description: `"${reminder.eventTitle}" is starting soon!`,
        duration: 10000, // Show for 10 seconds
      })

      // Mark as notified
      markReminderAsNotified(reminder.eventId)
    })

    setLastCheck(new Date())
  }

  // Check for notifications on mount and periodically
  useEffect(() => {
    // Check immediately on mount
    checkNotifications()

    // Then check every minute
    const interval = setInterval(checkNotifications, 60000)

    return () => clearInterval(interval)
  }, [])

  return <NotificationContext.Provider value={{ checkNotifications }}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
