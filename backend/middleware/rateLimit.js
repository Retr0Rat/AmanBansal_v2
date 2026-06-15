import rateLimit from 'express-rate-limit'

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many messages sent. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
})
