import { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import AvatarHover from './AvatarHover'
import { SpaceshipContext } from '../App'
import '../styles/navbar.css'

const PAGE_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
]

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <polygon points="3,1 13,7 3,13" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <rect x="2" y="1" width="4" height="12" />
      <rect x="8" y="1" width="4" height="12" />
    </svg>
  )
}

export default function Navbar({ onMenuToggle, menuOpen }) {
  const [isLight, setIsLight] = useState(
    () => localStorage.getItem('theme') === 'light'
  )
  const location = useLocation()
  const ctx = useContext(SpaceshipContext)
  const spaceshipActive  = ctx?.spaceshipActive  ?? false
  const setSpaceshipActive = ctx?.setSpaceshipActive ?? null

  const [showHint, setShowHint] = useState(
    () => !sessionStorage.getItem('spaceship-hint-seen')
  )

  const toggleTheme = () => {
    const next = !isLight
    setIsLight(next)
    document.documentElement.classList.toggle('light-theme', next)
    localStorage.setItem('theme', next ? 'light' : 'dark')
  }

  const handleSpaceshipClick = () => {
    setSpaceshipActive(v => !v)
    if (showHint) {
      setShowHint(false)
      sessionStorage.setItem('spaceship-hint-seen', '1')
    }
  }

  useEffect(() => {
    if (!showHint) return
    const t = setTimeout(() => {
      setShowHint(false)
      sessionStorage.setItem('spaceship-hint-seen', '1')
    }, 7000)
    return () => clearTimeout(t)
  }, [showHint])

  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Main navigation"
    >
      <div className="navbar__logo">
        <AvatarHover direction="below">
          <Link to="/" className="navbar__logo-text">AB</Link>
        </AvatarHover>
      </div>

      <nav className="navbar__nav" aria-label="Primary navigation">
        {PAGE_LINKS.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className={`navbar__nav-link${location.pathname === to ? ' navbar__nav-link--active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="navbar__right">
        {setSpaceshipActive && (
          <button
            className={`nav__spaceship-btn${spaceshipActive ? ' nav__spaceship-btn--active nav__spaceship-btn--pulse' : ''}`}
            onClick={handleSpaceshipClick}
            aria-label={spaceshipActive ? 'Pause spaceship' : 'Launch spaceship'}
          >
            {spaceshipActive ? <PauseIcon /> : <PlayIcon />}
            {showHint && (
              <span className="nav__spaceship-hint">launch</span>
            )}
          </button>
        )}

        <motion.button
          className="navbar__theme-btn"
          onClick={toggleTheme}
          aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isLight ? 'sun' : 'moon'}
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="navbar__theme-icon"
            >
              {isLight ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <button
          className="navbar__menu-btn"
          onClick={onMenuToggle}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="navbar__menu-label">{menuOpen ? 'CLOSE' : 'MENU'}</span>
          <div className="navbar__menu-icon" aria-hidden="true">
            <motion.span
              className="navbar__line"
              animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="navbar__line"
              animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </button>
      </div>
    </motion.nav>
  )
}
