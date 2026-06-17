import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import dns from 'dns'
import contactRoutes from './routes/contact.js'

dotenv.config()

// ISP DNS servers can refuse TCP SRV queries required by mongodb+srv://
// Use Google DNS as a reliable fallback
dns.setServers(['8.8.8.8', '8.8.4.4'])

const isProd = process.env.NODE_ENV === 'production'

// Only log non-error output in development
const log = (...args) => {
  if (!isProd) console.log(...args)
}

const app = express()
app.set('trust proxy', 1)

app.use(helmet())

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:4173',
    ]
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json({ limit: '10kb' }))

app.use('/api/contact', contactRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    log('MongoDB connected')
    const server = app.listen(process.env.PORT || 5000, () => {
      log(`Server running on port ${process.env.PORT || 5000}`)
    })

    // Graceful shutdown — Railway sends SIGTERM on every deploy
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down gracefully')
      server.close(async () => {
        await mongoose.connection.close()
        console.log('Server and DB connections closed')
        process.exit(0)
      })
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  })
