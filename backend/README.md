# Portfolio Contact API

Node.js + Express + MongoDB + Nodemailer backend for
the Aman Bansal portfolio contact form.

## Stack
- Express — HTTP server
- MongoDB + Mongoose — message storage
- Nodemailer — email delivery via Gmail SMTP
- express-rate-limit — spam protection (5/hr per IP)
- express-validator — input validation + sanitization
- helmet — security headers

## Setup

1. Install dependencies:
   cd backend && npm install

2. Copy .env.example to .env and fill in values:
   cp .env.example .env

3. Gmail App Password setup:
   - Go to myaccount.google.com/security
   - Enable 2-Factor Authentication
   - Go to App Passwords
   - Generate password for "Mail"
   - Use that 16-character password as EMAIL_PASS
   Note: Use aman.bansal1@dcmail.ca — check if DC mail
   supports Gmail SMTP or use a Gmail account as relay

4. Run locally:
   npm run dev

5. Deploy to Railway:
   - Push backend/ to GitHub (same repo or separate)
   - Connect repo to Railway
   - Add all .env variables in Railway dashboard
   - Railway auto-deploys on every push

## API

POST /api/contact
Body: { name, email, subject, message, website }
website field is a honeypot — must be empty

GET /health
Returns: { status: 'ok', timestamp }

## Environment Variables

PORT          — server port (Railway sets this auto)
MONGODB_URI   — MongoDB Atlas connection string
EMAIL_USER    — aman.bansal1@dcmail.ca
EMAIL_PASS    — Gmail app password (16 chars)
EMAIL_TO      — aman.bansal1@dcmail.ca
FRONTEND_URL  — https://retr0rat.github.io
NODE_ENV      — production
