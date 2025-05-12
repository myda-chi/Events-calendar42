import type { Event } from "@/lib/types"

// Types for our reminder system
export interface EventReminder {
  eventId: string
  eventTitle: string
  eventDate: string
  reminderTime: string // ISO string of when to send the reminder
  notified: boolean
}

// LocalStorage key
const REMINDERS_STORAGE_KEY = "42-events-calendar-reminders"

// Get all reminders from localStorage
export function getAllReminders(): EventReminder[] {
  if (typeof window === "undefined") return []

  try {
    const storedReminders = localStorage.getItem(REMINDERS_STORAGE_KEY)
    return storedReminders ? JSON.parse(storedReminders) : []
  } catch (error) {
    console.error("Error getting reminders from storage:", error)
    return []
  }
}

// Add a new reminder
export function addReminder(event: Event, reminderOffset: number): EventReminder | null {
  if (typeof window === "undefined") return null

  try {
    const eventDate = new Date(event.startDate)

    // Calculate the reminder time based on the offset (in minutes)
    const reminderTime = new Date(eventDate.getTime() - reminderOffset * 60 * 1000)

    // Don't add reminders for past times
    if (reminderTime < new Date()) {
      console.warn("Cannot set reminder for past time")
      return null
    }

    const reminder: EventReminder = {
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.startDate,
      reminderTime: reminderTime.toISOString(),
      notified: false,
    }

    const reminders = getAllReminders()

    // Check if a reminder for this event already exists
    const existingIndex = reminders.findIndex((r) => r.eventId === event.id)

    if (existingIndex !== -1) {
      // Update existing reminder
      reminders[existingIndex] = reminder
    } else {
      // Add new reminder
      reminders.push(reminder)
    }

    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders))
    return reminder
  } catch (error) {
    console.error("Error adding reminder:", error)
    return null
  }
}

// Remove a reminder
export function removeReminder(eventId: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const reminders = getAllReminders()
    const filteredReminders = reminders.filter((reminder) => reminder.eventId !== eventId)

    if (filteredReminders.length === reminders.length) {
      return false // No reminder was removed
    }

    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(filteredReminders))
    return true
  } catch (error) {
    console.error("Error removing reminder:", error)
    return false
  }
}

// Check if a reminder exists for an event
export function hasReminder(eventId: string): boolean {
  if (typeof window === "undefined") return false

  const reminders = getAllReminders()
  return reminders.some((reminder) => reminder.eventId === eventId)
}

// Mark a reminder as notified
export function markReminderAsNotified(eventId: string): void {
  if (typeof window === "undefined") return

  try {
    const reminders = getAllReminders()
    const updatedReminders = reminders.map((reminder) => {
      if (reminder.eventId === eventId) {
        return { ...reminder, notified: true }
      }
      return reminder
    })

    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(updatedReminders))
  } catch (error) {
    console.error("Error marking reminder as notified:", error)
  }
}

// Get all due reminders (reminders that should be shown now)
export function getDueReminders(): EventReminder[] {
  if (typeof window === "undefined") return []

  const now = new Date()
  const reminders = getAllReminders()

  return reminders.filter((reminder) => {
    const reminderTime = new Date(reminder.reminderTime)
    return !reminder.notified && reminderTime <= now
  })
}
