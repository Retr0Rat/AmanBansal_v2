import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import AvatarHover from './AvatarHover'
import { CONTACT } from '../data/constants'
import '../styles/menu.css'

const NAV_LINKS = [
  { label: 'Home', id: 'hero' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'About', href: '/about', isPage: true },
  { label: 'Blog', href: '/blog', isPage: true },
  { label: 'Connect', href: '/connect', isPage: true },
]

export default function MenuOverlay({ onClose, scrollTo }) {
  const prefersReducedMotion = useReducedMotion()
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (link) => {
    if (link.isPage) {
      onClose()
      navigate(link.href)
      return
    }
    if (location.pathname === '/') {
      scrollTo(link.id)
    } else {
      onClose()
      navigate(`/#${link.id}`)
    }
  }

  const overlayVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  } : {
    hidden: { clipPath: 'inset(0 0 100% 0)' },
    visible: {
      clipPath: 'inset(0 0 0% 0)',
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      clipPath: 'inset(0 0 100% 0)',
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 },
    },
  }

  const linkContainerVariants = prefersReducedMotion ? {} : {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
    exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  }

  const linkVariants = prefersReducedMotion ? {
    hidden: {},
    visible: {},
    exit: {},
  } : {
    hidden: { y: '110%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      y: '-110%',
      opacity: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const metaVariants = prefersReducedMotion ? {
    hidden: {},
    visible: {},
    exit: {},
  } : {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.7 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      className="menu-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="menu-overlay__logo">
        <AvatarHover>
          <span className="menu-overlay__logo-text">AB</span>
        </AvatarHover>
      </div>

      <motion.nav
        className="menu-overlay__nav"
        variants={linkContainerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        aria-label="Overlay navigation"
      >
        {NAV_LINKS.map((navLink, index) => (
          <div key={navLink.id ?? navLink.href} className="menu-overlay__link-wrapper">
            <motion.button
              className="menu-overlay__link"
              variants={linkVariants}
              onClick={() => handleNavClick(navLink)}
              aria-label={`Navigate to ${navLink.label}`}
            >
              <span className="menu-overlay__link-num">
                {String(index + 1).padStart(2, '0')}
              </span>
              {navLink.label}
            </motion.button>
          </div>
        ))}
      </motion.nav>

      <motion.div
        className="menu-overlay__meta"
        variants={metaVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="menu-overlay__meta-col">
          <p className="menu-overlay__meta-label">Location</p>
          <p className="menu-overlay__meta-value">Oshawa, ON, Canada</p>
        </div>
        <div className="menu-overlay__meta-col">
          <p className="menu-overlay__meta-label">Contact</p>
          <a className="menu-overlay__meta-value" href="mailto:probansalaman03@gmail.com">
            probansalaman03@gmail.com
          </a>
        </div>
        <div className="menu-overlay__meta-col">
          <p className="menu-overlay__meta-label">GitHub</p>
          <a
            className="menu-overlay__meta-value"
            href={CONTACT.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CONTACT.githubDisplay}
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}
