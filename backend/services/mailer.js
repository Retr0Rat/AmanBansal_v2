import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

// Verify transporter on startup so email failures surface immediately
transporter.verify((error) => {
  if (error) {
    console.error('Email transporter error:', error.message)
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email server ready')
    }
  }
})

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

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `[Portfolio] ${safeSubject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont,
            'Segoe UI', sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            margin: 0; padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: #111111;
            border: 1px solid #222222;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background: #ffffff;
            color: #0a0a0a;
            padding: 32px 40px;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.02em;
          }
          .header p {
            margin: 6px 0 0;
            font-size: 13px;
            color: #555555;
          }
          .body { padding: 40px; }
          .field { margin-bottom: 28px; }
          .label {
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #888888;
            margin-bottom: 8px;
          }
          .value {
            font-size: 15px;
            color: #ffffff;
            line-height: 1.6;
          }
          .message-box {
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 6px;
            padding: 20px;
            font-size: 15px;
            line-height: 1.7;
            color: #dddddd;
            white-space: pre-wrap;
          }
          .reply-btn {
            display: inline-block;
            margin-top: 32px;
            padding: 12px 28px;
            background: #ffffff;
            color: #0a0a0a;
            text-decoration: none;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.04em;
          }
          .footer {
            padding: 24px 40px;
            border-top: 1px solid #222222;
            font-size: 12px;
            color: #555555;
          }
          .divider {
            border: none;
            border-top: 1px solid #222222;
            margin: 28px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Portfolio Message</h1>
            <p>Someone reached out through your contact form</p>
          </div>
          <div class="body">
            <div class="field">
              <div class="label">From</div>
              <div class="value">${safeName}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${safeEmail}</div>
            </div>
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${safeSubject}</div>
            </div>
            <hr class="divider" />
            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">${safeMessage}</div>
            </div>
            <a href="mailto:${safeEmail}?subject=Re: ${safeSubject}"
               class="reply-btn">
              Reply to ${safeName}
            </a>
          </div>
          <div class="footer">
            Received: ${escapeHtml(formattedDate)} (Toronto time)
            &nbsp;·&nbsp;
            Sent from amanbansal.dev portfolio
          </div>
        </div>
      </body>
      </html>
    `
  }

  return transporter.sendMail(mailOptions)
}
