import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendContactEmail = async ({
  name, email, subject, message, receivedAt
}) => {
  const formattedDate = new Date(receivedAt)
    .toLocaleString('en-CA', {
      timeZone: 'America/Toronto',
      dateStyle: 'full',
      timeStyle: 'short'
    })

  return resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    html: `
      <h2>New message from ${name}</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <p><strong>Received:</strong> ${formattedDate}</p>
    `
  })
}
