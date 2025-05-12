# Email Notification Setup

This application uses EmailJS to send email notifications when users register for events. Follow these steps to set up the email service:

## Setting up EmailJS

1. **Create an EmailJS Account**:
   - Go to [EmailJS](https://www.emailjs.com/) and sign up for a free account
   - The free tier allows 200 emails per month

2. **Create an Email Service**:
   - In your EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the instructions to connect your email account

3. **Create an Email Template**:
   - Go to "Email Templates"
   - Click "Create New Template"
   - Name it "event_registration"
   - Design your template using the following variables:
     - {{event_title}} - The title of the event
     - {{event_date}} - The date of the event
     - {{event_location}} - The location of the event
     - {{attendee_name}} - The name of the person registering
     - {{attendee_email}} - The email of the person registering
     - {{ticket_count}} - The number of tickets requested
     - {{registration_time}} - The time of registration

   Example template:
   \`\`\`
   Subject: New Registration for {{event_title}}

   Hello,

   A new registration has been received for the event "{{event_title}}".

   Event Details:
   - Date: {{event_date}}
   - Location: {{event_location}}

   Attendee Information:
   - Name: {{attendee_name}}
   - Email: {{attendee_email}}
   - Number of Tickets: {{ticket_count}}

   Registration was completed at {{registration_time}}.

   Best regards,
   42 Events Calendar
   \`\`\`

4. **Update the Email Service Configuration**:
   - Open the file `lib/email-service.ts`
   - Replace the placeholder values with your actual EmailJS credentials:
     - `serviceID`: Your EmailJS service ID (e.g., "gmail")
     - `templateID`: Your EmailJS template ID (e.g., "event_registration")
     - `userID`: Your EmailJS user ID (found in Account > API Keys)

## Testing the Email Service

1. Register for an event on the website
2. Check the console for a "MOCK EMAIL SENT" message (this is used during development)
3. Once you've set up EmailJS, the actual emails will be sent to myda-chi@student.42abudhabi.ae

## Troubleshooting

- If emails are not being sent, check the browser console for errors
- Verify your EmailJS credentials are correct
- Make sure your email service is properly connected in the EmailJS dashboard
- Check if you've reached the free tier limit (200 emails per month)
