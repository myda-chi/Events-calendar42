import type { Event } from "@/lib/types"
import { featuredEvents } from "@/lib/data"

// Keys for localStorage
const EVENTS_STORAGE_KEY = "42-events-calendar-events"
const ADMIN_AUTH_KEY = "42-events-calendar-admin-auth"

// Initialize events in localStorage if they don't exist
export function initializeEvents(): void {
  if (typeof window === "undefined") return

  const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY)
  if (!storedEvents) {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(featuredEvents))
  }
}

// Get all events from localStorage
export function getAllEventsFromStorage(): Event[] {
  if (typeof window === "undefined") return []

  try {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY)
    return storedEvents ? JSON.parse(storedEvents) : []
  } catch (error) {
    console.error("Error getting events from storage:", error)
    return []
  }
}

// Add a new event to localStorage
export function addEventToStorage(event: Event): void {
  if (typeof window === "undefined") return

  try {
    const events = getAllEventsFromStorage()
    events.push(event)
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error("Error adding event to storage:", error)
  }
}

// Update an existing event in localStorage
export function updateEventInStorage(updatedEvent: Event): void {
  if (typeof window === "undefined") return

  try {
    const events = getAllEventsFromStorage()
    const index = events.findIndex((event) => event.id === updatedEvent.id)

    if (index !== -1) {
      events[index] = updatedEvent
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
    }
  } catch (error) {
    console.error("Error updating event in storage:", error)
  }
}

// Delete an event from localStorage
export function deleteEventFromStorage(eventId: string): void {
  if (typeof window === "undefined") return

  try {
    const events = getAllEventsFromStorage()
    const filteredEvents = events.filter((event) => event.id !== eventId)
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents))
  } catch (error) {
    console.error("Error deleting event from storage:", error)
    throw error // Re-throw the error so we can handle it in the component
  }
}

// Admin authentication
export function setAdminAuth(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ADMIN_AUTH_KEY, token)
}

export function getAdminAuth(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ADMIN_AUTH_KEY)
}

export function clearAdminAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ADMIN_AUTH_KEY)
}

export function isAdminAuthenticated(): boolean {
  return getAdminAuth() === "admin-token-42"
}
