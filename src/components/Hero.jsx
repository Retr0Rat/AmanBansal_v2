import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ASSETS } from '../data/constants'
import '../styles/hero.css'

const TITLE_LINES = ['Aman', 'Bansal']

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
}

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

export default function Hero({ scrollTo }) {
  const [time, setTime] = useState('')
  const [timezone, setTimezone] = useState('')
  const [nameHovered, setNameHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const titleAreaRef = useRef(null)

  // Same spring physics as CTABlocks.jsx
  const imgX = useMotionValue(0)
  const imgY = useMotionValue(0)
  const springImgX = useSpring(imgX, { stiffness: 150, damping: 15 })
  const springImgY = useSpring(imgY, { stiffness: 150, damping: 15 })

  const handleNameMouseEnter = (e) => {
    if (!prefersReducedMotion && titleAreaRef.current) {
      const rect = titleAreaRef.current.getBoundingClientRect()
      imgX.set(e.clientX - rect.left - 40)
      imgY.set(e.clientY - rect.top - 40)
    }
    setNameHovered(true)
  }

  const handleNameMouseMove = (e) => {
    if (prefersReducedMotion || !titleAreaRef.current) return
    const rect = titleAreaRef.current.getBoundingClientRect()
    imgX.set(e.clientX - rect.left - 40)
    imgY.set(e.clientY - rect.top - 40)
  }

  const handleNameMouseLeave = () => {
    setNameHovered(false)
    imgX.set(0)
    imgY.set(0)
  }

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('en-CA', {
          timeZone: 'America/Toronto',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      )
      setTimezone(
        new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', timeZoneName: 'short' })
          .formatToParts(now)
          .find(p => p.type === 'timeZoneName')?.value ?? ''
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="hero" className="hero" aria-label="Hero section">
      <span className="hero__year-stamp" aria-hidden="true">EST. 2003</span>

      <div className="hero__top-bar">
        <motion.div
          className="hero__label hero__label-stack"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={1.2}
        >
          <span>Full-Stack</span>
          <span className="hero__label-dot" aria-hidden="true"> · </span>
          <span>AI</span>
          <span className="hero__label-dot" aria-hidden="true"> · </span>
          <span>Cybersecurity</span>
        </motion.div>
        <motion.span
          className="hero__label hero__label--right"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={1.3}
        >
          EST. 2003
        </motion.span>

        {/* Mobile only: location + coords move to top-right */}
        <motion.div
          className="hero__meta hero__meta--topright"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={1.3}
          aria-hidden="true"
        >
          <div className="hero__meta-item">
            <span className="hero__meta-label">Location</span>
            <span className="hero__meta-value">Oshawa, ON · Canada</span>
          </div>
          <div className="hero__meta-item">
            <span className="hero__meta-label">Coordinates</span>
            <span className="hero__meta-value">43.8971°N, 78.8658°W</span>
          </div>
        </motion.div>
      </div>

      <div className="hero__center">
        <div
          ref={titleAreaRef}
          className="hero__title-hover-area"
          onMouseEnter={handleNameMouseEnter}
          onMouseLeave={handleNameMouseLeave}
          onMouseMove={handleNameMouseMove}
        >
          <AnimatePresence>
            {nameHovered && (
              <motion.div
                className="hero__name-float"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.7 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={prefersReducedMotion ? undefined : { x: springImgX, y: springImgY }}
                aria-hidden="true"
              >
                <img src={ASSETS.avatar} alt="" width={80} height={80} loading="lazy" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="hero__title-container"
            variants={containerVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
          >
            {TITLE_LINES.map((word) => (
              <div key={word} className="hero__title-line">
                <motion.h1 className="hero__title" variants={wordVariants}>
                  {word}
                </motion.h1>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.p
          className="hero__tagline"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={1.1}
        >
          Building intelligent systems at the intersection
          <br />
          of AI, security, and software.
        </motion.p>
      </div>

      <div className="hero__bottom-bar">
        {/* Mobile only: EST. 2003 moves to bottom-left */}
        <motion.span
          className="hero__label hero__label--botleft"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={1.4}
          aria-hidden="true"
        >
          EST. 2003
        </motion.span>

        <motion.div
          className="hero__meta"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={1.4}
        >
          <div className="hero__meta-item">
            <span className="hero__meta-label">Location</span>
            <span className="hero__meta-value">Oshawa, ON · Canada</span>
          </div>
          <div className="hero__meta-item">
            <span className="hero__meta-label">Coordinates</span>
            <span className="hero__meta-value">43.8971°N, 78.8658°W</span>
          </div>
        </motion.div>

        <motion.button
          className="hero__scroll-indicator"
          onClick={() => scrollTo('about')}
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={1.6}
          aria-label="Scroll to about section"
        >
          <motion.div
            className="hero__scroll-arrow"
            animate={prefersReducedMotion ? { y: 0 } : { y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <path
                d="M8 0v20M1 13l7 7 7-7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span className="hero__scroll-text">Scroll</span>
        </motion.button>

        <motion.div
          className="hero__clock"
          variants={fadeUpVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          custom={1.4}
        >
          <span className="hero__meta-label">Local Time</span>
          <span className="hero__time">{time}</span>
          {timezone && <span className="hero__timezone">{timezone}</span>}
        </motion.div>
      </div>
    </section>
  )
}
