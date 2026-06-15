import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Footer from '../components/Footer'
import { CONTACT } from '../data/constants'
import '../styles/connect.css'

// Exact copies from Hero.jsx
const wordVariants = {
  hidden: { y: '110%', opacity: 0, skewY: 4 },
  visible: {
    y: '0%',
    opacity: 1,
    skewY: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

const FIELDS = [
  { name: 'name',    label: 'Name',    type: 'text',  placeholder: 'Your name',          autoComplete: 'name' },
  { name: 'email',   label: 'Email',   type: 'email', placeholder: 'your@email.com',     autoComplete: 'email' },
  { name: 'subject', label: 'Subject', type: 'text',  placeholder: "What's this about?", autoComplete: 'off' },
]

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Set VITE_API_URL in .env.local for local dev and in Vercel env vars for production.
// Value should be your Railway backend URL, e.g. https://your-app.railway.app

export default function Connect() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' })
  const prefersReducedMotion = useReducedMotion()

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.website) return

    setLoading(true)
    setError(false)

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Something went wrong.')
      }
    } catch (err) {
      setError(
        'Could not reach the server. Email me directly at aman.bansal1@dcmail.ca'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Navbar onMenuToggle={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />

      <AnimatePresence>
        {menuOpen && (
          <MenuOverlay onClose={() => setMenuOpen(false)} scrollTo={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>

      <main className="connect-main">
        <div className="connect__back">
          <motion.div
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0}
          >
            <Link to="/" className="connect__back-link">← Home</Link>
          </motion.div>
        </div>

        <div className="connect__inner">
          <motion.span
            className="connect__tag"
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.2}
          >
            05: Connect
          </motion.span>

          {/* Hero.jsx wordVariants slide-up */}
          <div className="connect__heading-line">
            <motion.h1
              className="connect__heading"
              variants={wordVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
            >
              Let's Talk
            </motion.h1>
          </div>

          {/* Framer Motion stagger fade-in on mount - buttons/tags pattern */}
          <motion.div
            className="connect__top-actions"
            {...(prefersReducedMotion ? {} : {
              initial: 'hidden',
              animate: 'visible',
              variants: {
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } },
              },
            })}
          >
            {[
              { label: 'Send Email ↗', href: `mailto:${CONTACT.email}` },
              { label: 'Book a Meeting ↗', href: 'https://calendly.com/gujjeramanishere/30min' },
            ].map(({ label, href }) => (
              <motion.a
                key={label}
                href={href}
                className="connect__action-btn"
                {...(prefersReducedMotion ? {} : {
                  variants: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } },
                })}
              >
                {label}
              </motion.a>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.p
                key="success"
                className="connect__success"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Thanks, I'll be in touch.
              </motion.p>
            ) : (
              /* Framer Motion fade + slide-up on form mount */
              <motion.form
                key="form"
                className="connect-form"
                onSubmit={handleSubmit}
                aria-label="Contact form"
                {...(prefersReducedMotion ? {} : {
                  initial: { opacity: 0, y: 32 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] },
                })}
              >
                {FIELDS.map(({ name, label, type, placeholder, autoComplete }) => (
                  <div key={name} className="connect-form__field">
                    <label className="connect-form__label" htmlFor={name}>{label}</label>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      className="connect-form__input"
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={handleChange}
                      required
                      autoComplete={autoComplete}
                    />
                  </div>
                ))}

                <div className="connect-form__field">
                  <label className="connect-form__label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="connect-form__textarea"
                    placeholder="Tell me what you're working on..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Honeypot - hidden from humans, bots fill it; submission is silently dropped */}
                <input
                  name="website"
                  type="text"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                />

                <button type="submit" className="connect-form__submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>

                {error && (
                  <p style={{ color: 'var(--color-error, #e05555)', fontSize: '14px', marginTop: '12px' }}>
                    {error}
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </motion.div>
  )
}
