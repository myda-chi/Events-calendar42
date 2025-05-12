"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Clock, MapPin, Users, DollarSign, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { addEventToStorage, updateEventInStorage } from "@/lib/client-storage"
import type { Event } from "@/lib/types"

interface EventFormProps {
  existingEvent?: Event
}

export default function EventForm({ existingEvent }: EventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(
    existingEvent ? new Date(existingEvent.startDate) : undefined,
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    existingEvent?.endDate ? new Date(existingEvent.endDate) : undefined,
  )
  const [startTime, setStartTime] = useState(
    existingEvent ? new Date(existingEvent.startDate).toTimeString().slice(0, 5) : "",
  )
  const [endTime, setEndTime] = useState(
    existingEvent?.endDate ? new Date(existingEvent.endDate).toTimeString().slice(0, 5) : "",
  )
  const [isPublished, setIsPublished] = useState(existingEvent?.isPublished ?? true)
  const [isFeatured, setIsFeatured] = useState(existingEvent?.isFeatured ?? false)

  // Form fields
  const [title, setTitle] = useState(existingEvent?.title || "")
  const [description, setDescription] = useState(existingEvent?.description || "")
  const [content, setContent] = useState(existingEvent?.content || "")
  const [category, setCategory] = useState(existingEvent?.category || "")
  const [location, setLocation] = useState(existingEvent?.location || "")
  const [capacity, setCapacity] = useState(existingEvent?.capacity.toString() || "50")
  const [price, setPrice] = useState(existingEvent?.price.toString() || "0")
  const [image, setImage] = useState(existingEvent?.image || "/images/42-abu-dhabi-logo.png")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate || !startTime) {
      toast({
        title: "Missing information",
        description: "Please provide a start date and time for the event.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Combine date and time
      const startDateTime = new Date(startDate)
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      startDateTime.setHours(startHours, startMinutes)

      let endDateTime: Date | undefined
      if (endDate && endTime) {
        endDateTime = new Date(endDate)
        const [endHours, endMinutes] = endTime.split(":").map(Number)
        endDateTime.setHours(endHours, endMinutes)
      }

      // Create event object
      const newEvent: Event = {
        id: existingEvent?.id || `event-${Date.now()}`,
        title,
        description,
        content,
        image,
        category,
        location,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime?.toISOString(),
        price: Number.parseFloat(price),
        capacity: Number.parseInt(capacity),
        attendees: existingEvent?.attendees || 0,
        organizer: existingEvent?.organizer || {
          id: "admin",
          name: "42 Events Admin",
          image: "/images/42-abu-dhabi-logo.png",
        },
        isFeatured,
        isPublished,
        createdAt: existingEvent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to localStorage
      if (existingEvent) {
        updateEventInStorage(newEvent)
      } else {
        addEventToStorage(newEvent)
      }

      toast({
        title: existingEvent ? "Event updated" : "Event created",
        description: existingEvent
          ? "Your event has been successfully updated."
          : "Your event has been successfully created.",
      })

      // Redirect to admin dashboard
      router.push("/admin")
      router.refresh() // Force a refresh to show the new event
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: "There was an error saving the event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="glass-card mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  required
                  className="bg-background/40"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a brief event description"
                  required
                  className="min-h-20 bg-background/40"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content">Full Content (HTML supported)</Label>
                <Textarea
                  id="content"
                  placeholder="Enter detailed event content"
                  className="min-h-32 bg-background/40"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select required value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="bg-background/40">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Meetup">Meetup</SelectItem>
                    <SelectItem value="Tech Talk">Tech Talk</SelectItem>
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Examination">Examination</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter event location"
                    required
                    className="pl-10 bg-background/40"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date & Time</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-background/40",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? formatDate(startDate.toISOString()) : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="glass-card p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-10 bg-background/40"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>End Date & Time</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal bg-background/40",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? formatDate(endDate.toISOString()) : <span>Select date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="glass-card p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      className="pl-10 bg-background/40"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Max attendees"
                    min="1"
                    required
                    className="pl-10 bg-background/40"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="0 for free"
                    min="0"
                    step="0.01"
                    required
                    className="pl-10 bg-background/40"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="image"
                    placeholder="Image URL"
                    className="pl-10 bg-background/40"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2">
                <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label htmlFor="featured">Feature on homepage</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.push("/admin")} className="bg-background/40">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          {isSubmitting ? "Saving..." : existingEvent ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
