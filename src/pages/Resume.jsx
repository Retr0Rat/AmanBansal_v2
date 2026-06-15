import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Footer from '../components/Footer'
import { CONTACT } from '../data/constants'

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

export default function Resume() {
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

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

      <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <motion.div
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0}
          >
            <Link
              to="/"
              style={{ color: 'var(--grey)', fontSize: '0.85rem', textDecoration: 'none', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '3rem' }}
            >
              ← Home
            </Link>
          </motion.div>

          <motion.span
            style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grey)', display: 'block', marginBottom: '1.5rem' }}
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.15}
          >
            06: Resume
          </motion.span>

          <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
            <motion.h1
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontFamily: 'var(--font-heading)', fontWeight: 300, margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text)' }}
              variants={wordVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
            >
              Resume
            </motion.h1>
          </div>

          <motion.p
            style={{ fontSize: '1.05rem', color: 'var(--grey)', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '520px' }}
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.6}
          >
            Download or view my full resume below.
          </motion.p>

          <motion.div
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.8}
          >
            <a
              href={`${import.meta.env.BASE_URL}Aman_Bansal_Resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                background: 'var(--text)',
                color: 'var(--bg)',
                border: '1px solid var(--text)',
                borderRadius: '2px',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              View Resume ↗
            </a>

            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                background: 'transparent',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '2px',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              View on LinkedIn ↗
            </a>
          </motion.div>
        </div>
      </main>

      <Footer />
    </motion.div>
  )
}
