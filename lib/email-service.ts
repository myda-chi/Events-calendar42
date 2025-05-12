// This service uses EmailJS to send emails directly from the client side
// You'll need to sign up for a free account at https://www.emailjs.com/

interface EmailParams {
  eventTitle: string
  eventDate: string
  eventLocation: string
  attendeeName: string
  attendeeEmail: string
  ticketCount: number
}

export async function sendEventRegistrationEmail(params: EmailParams): Promise<boolean> {
  try {
    // EmailJS service configuration
    const serviceID = "default_service" // Replace with your EmailJS service ID
    const templateID = "event_registration" // Replace with your EmailJS template ID
    const userID = "YOUR_USER_ID" // Replace with your EmailJS user ID

    // Prepare the template parameters
    const templateParams = {
      to_email: "myda-chi@student.42abudhabi.ae",
      event_title: params.eventTitle,
      event_date: params.eventDate,
      event_location: params.eventLocation,
      attendee_name: params.attendeeName,
      attendee_email: params.attendeeEmail,
      ticket_count: params.ticketCount,
      registration_time: new Date().toLocaleString(),
    }

    // Load EmailJS dynamically
    const emailjs = await import("@emailjs/browser")

    // Send the email
    await emailjs.send(serviceID, templateID, templateParams, userID)

    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Mock function for development/testing when EmailJS is not set up
export async function mockSendEmail(params: EmailParams): Promise<boolean> {
  console.log("MOCK EMAIL SENT:", {
    to: "myda-chi@student.42abudhabi.ae",
    subject: `New Registration: ${params.eventTitle}`,
    body: `
      New event registration:
      
      Event: ${params.eventTitle}
      Date: ${params.eventDate}
      Location: ${params.eventLocation}
      
      Attendee: ${params.attendeeName}
      Email: ${params.attendeeEmail}
      Tickets: ${params.ticketCount}
      
      Registration time: ${new Date().toLocaleString()}
    `,
  })

  return true
}
