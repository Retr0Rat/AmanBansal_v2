import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const escapeHtml = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

export const sendContactEmail = async ({
  name, email, subject, message, receivedAt
}) => {
  const safeName    = escapeHtml(name)
  const safeEmail   = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message)
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
    subject: `[Portfolio] ${safeSubject}`,
    html: `
      <h2>New message from ${safeName}</h2>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Subject:</strong> ${safeSubject}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
      <p><strong>Received:</strong> ${escapeHtml(formattedDate)}</p>
    `
  })
}
