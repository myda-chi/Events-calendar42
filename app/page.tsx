"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import HeroSection from "@/components/hero-section"
import EventCard from "@/components/event-card"
import { getAllEventsFromStorage, initializeEvents } from "@/lib/client-storage"
import type { Event } from "@/lib/types"

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize events in localStorage if they don't exist
    initializeEvents()

    // Get events from localStorage
    const storedEvents = getAllEventsFromStorage()
    setEvents(storedEvents)
    setIsLoading(false)
  }, [])

  // Sort events by date (closest first) and filter for featured events
  const featuredEvents = events
    .filter((event) => event.isFeatured && event.isPublished)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3)

  // Get upcoming events
  const upcomingEvents = events
    .filter((event) => new Date(event.startDate) > new Date() && event.isPublished)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3)

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading events...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="glass-card p-8 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Featured Events</h2>
              <Button asChild variant="outline" className="mt-4 md:mt-0 border-accent text-accent hover:bg-accent/10">
                <Link href="/events">
                  View All Events <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.length > 0 ? (
                featuredEvents.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No featured events available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Workshops", "Meetups", "Tech Talks", "Hackathons", "Conferences", "Social", "Sports", "Education"].map(
                (category) => (
                  <Link
                    key={category}
                    href={`/events?category=${category.toLowerCase()}`}
                    className="bg-background/20 rounded-lg p-6 text-center hover:bg-background/40 transition-colors border border-border/20"
                  >
                    <h3 className="font-medium text-foreground">{category}</h3>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background/20 border-border/20">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-accent/20 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-accent font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Find Events</h3>
                  <p className="text-muted-foreground">
                    Browse through our curated list of events or search for specific ones that match your interests.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/20 border-border/20">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-accent/20 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-accent font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Register</h3>
                  <p className="text-muted-foreground">
                    Sign up for events with a simple registration process. Secure your spot in just a few clicks.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/20 border-border/20">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-accent/20 w-12 h-12 flex items-center justify-center mb-4">
                    <span className="text-accent font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Attend & Enjoy</h3>
                  <p className="text-muted-foreground">
                    Receive confirmation and reminders. Attend the event and enjoy the experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="glass-card p-8 rounded-xl">
            <h2 className="text-3xl font-bold text-foreground mb-8">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`} className="block">
                    <div className="bg-background/20 rounded-lg p-4 hover:bg-background/40 transition-colors border border-border/20">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="md:w-24 flex-shrink-0">
                          <div className="bg-black rounded-lg p-2 text-center flex items-center justify-center h-24">
                            <Image
                              src={event.image || "/placeholder.svg"}
                              alt={event.title}
                              width={60}
                              height={60}
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(event.startDate).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-32 flex-shrink-0 mt-4 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-accent text-accent hover:bg-accent/10"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming events available.</p>
                </div>
              )}
            </div>
            <div className="mt-8 text-center">
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
