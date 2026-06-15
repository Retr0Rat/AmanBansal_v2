import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Footer from '../components/Footer'
import '../styles/not-found.css'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function NotFound() {
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div>
      <Navbar onMenuToggle={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />

      <AnimatePresence>
        {menuOpen && (
          <MenuOverlay onClose={() => setMenuOpen(false)} scrollTo={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>

      <main className="nf-main">
        <motion.h1
          className="nf-code"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={0.3}
        >
          404
        </motion.h1>

        <motion.p
          className="nf-message"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={0.5}
        >
          This page doesn&apos;t exist.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={0.7}
        >
          <Link to="/" className="nf-back">← Back Home</Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
