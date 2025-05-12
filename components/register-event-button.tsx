"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { Event } from "@/lib/types"
import { mockSendEmail } from "@/lib/email-service"
import { formatDate } from "@/lib/utils"

interface RegisterEventButtonProps {
  event: Event
}

export default function RegisterEventButton({ event }: RegisterEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [ticketCount, setTicketCount] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async () => {
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Send email notification
      const emailSent = await mockSendEmail({
        eventTitle: event.title,
        eventDate: formatDate(event.startDate),
        eventLocation: event.location,
        attendeeName: name,
        attendeeEmail: email,
        ticketCount: Number.parseInt(ticketCount || "1"),
      })

      if (emailSent) {
        toast({
          title: "Registration successful!",
          description: `You have registered for ${event.title}. A confirmation has been sent to the event organizer.`,
        })
      } else {
        toast({
          title: "Registration successful!",
          description: `You have registered for ${event.title}. However, there was an issue sending the notification email.`,
        })
      }

      // Close the dialog
      setIsOpen(false)

      // Reset form
      setName("")
      setEmail("")
      setTicketCount("1")

      // In a real app, you would redirect to a confirmation page
      // router.push(`/events/${event.id}/confirmation`)
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration error",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const ticketOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString())
  const totalPrice = event.price * Number.parseInt(ticketCount || "1")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Register Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription>Complete your registration for {event.title}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tickets" className="text-right">
              Tickets
            </Label>
            <Select value={ticketCount} onValueChange={setTicketCount}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select number of tickets" />
              </SelectTrigger>
              <SelectContent>
                {ticketOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {event.price > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Price</Label>
              <div className="col-span-3">${totalPrice.toFixed(2)}</div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your full name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email address"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleRegister} disabled={isLoading}>
            {isLoading ? "Processing..." : "Complete Registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
