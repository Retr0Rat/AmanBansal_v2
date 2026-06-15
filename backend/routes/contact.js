import express from 'express'
import { body, validationResult } from 'express-validator'
import Message from '../models/Message.js'
import { sendContactEmail } from '../services/mailer.js'
import { contactLimiter } from '../middleware/rateLimit.js'

const router = express.Router()

const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ max: 200 }).withMessage('Subject too long'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be 10-2000 characters'),
  body('website')
    .isEmpty().withMessage('Bot detected')
]

router.post('/',
  contactLimiter,
  validateContact,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg
      })
    }

    const { name, email, subject, message } = req.body

    try {
      const savedMessage = await Message.create({
        name,
        email,
        subject,
        message,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        receivedAt: new Date()
      })

      await sendContactEmail({
        name,
        email,
        subject,
        message,
        receivedAt: savedMessage.receivedAt
      })

      res.status(200).json({
        success: true,
        message: 'Message sent successfully'
      })

    } catch (err) {
      console.error('Contact form error:', err)
      res.status(500).json({
        error: 'Failed to send message. Please email directly.'
      })
    }
  }
)

export default router
