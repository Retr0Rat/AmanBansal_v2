import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, createContext } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import Preloader from './components/Preloader'
import AmanBot from './components/AmanBot'
import CanvasReveal from './components/CanvasReveal'
import './index.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProjectsPage = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const AboutFull = lazy(() => import('./pages/AboutFull'))
const Connect = lazy(() => import('./pages/Connect'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const Resume = lazy(() => import('./pages/Resume'))
const NotFound = lazy(() => import('./pages/NotFound'))

export const SpaceshipContext = createContext(null)

function getStarColor() {
  return document.documentElement.classList.contains('light-theme')
    ? [20, 20, 20]
    : [255, 255, 255]
}

function getBaseOpacity() {
  return document.documentElement.classList.contains('light-theme') ? 0.55 : 1.0
}

// Subtle tints per section, per theme.
// Dark: shift white toward cool/warm hues. Light: shift dark toward hues.
const SECTION_COLORS = {
  dark: {
    hero:     [255, 255, 255],
    projects: [210, 225, 255],
    skills:   [255, 255, 255],
    about:    [255, 240, 218],
    cta:      [238, 218, 255],
  },
  light: {
    hero:     [20,  20,  20 ],
    projects: [14,  20,  42 ],
    skills:   [20,  20,  20 ],
    about:    [42,  20,  10 ],
    cta:      [32,  10,  42 ],
  },
}

function getSectionTint(section, isDark) {
  const palette = isDark ? SECTION_COLORS.dark : SECTION_COLORS.light
  return palette[section] ?? (isDark ? [255, 255, 255] : [20, 20, 20])
}

const SECTION_IDS = ['hero', 'projects', 'skills', 'about', 'cta']

function CanvasBackground({ ready, spaceshipActive }) {
  const location = useLocation()
  const scrollVelocityRef = useRef(3)
  const lastScrollYRef    = useRef(0)
  const tintRef           = useRef(getStarColor())
  const currentSectionRef = useRef('hero')
  const isDarkRef         = useRef(!document.documentElement.classList.contains('light-theme'))

  const [starColor,   setStarColor]   = useState(getStarColor)
  const [baseOpacity, setBaseOpacity] = useState(getBaseOpacity)

  // 500 ms grace period after preloader
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setShow(true), 500)
    return () => clearTimeout(t)
  }, [ready])

  const showCanvas = show

  // Theme change → update star color, opacity, and tint target
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = !document.documentElement.classList.contains('light-theme')
      isDarkRef.current = isDark
      setStarColor(getStarColor())
      setBaseOpacity(getBaseOpacity())
      tintRef.current = getSectionTint(currentSectionRef.current, isDark)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Section-based tinting - re-observe on every route change
  useEffect(() => {
    let observer = null
    const ratios = new Map()

    const t = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(e => ratios.set(e.target.id, e.intersectionRatio))
          let best = null, bestRatio = 0
          ratios.forEach((ratio, id) => {
            if (ratio > bestRatio) { bestRatio = ratio; best = id }
          })
          if (best && bestRatio > 0) {
            currentSectionRef.current = best
            tintRef.current = getSectionTint(best, isDarkRef.current)
          }
        },
        { threshold: [0, 0.1, 0.25, 0.5, 0.75] }
      )
      SECTION_IDS.forEach(id => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 300)

    return () => {
      clearTimeout(t)
      observer?.disconnect()
    }
  }, [location.pathname])

  // Scroll velocity boost
  useEffect(() => {
    const onScroll = () => {
      const current  = window.scrollY
      const velocity = Math.abs(current - lastScrollYRef.current)
      lastScrollYRef.current = current
      const target = Math.min(3 + velocity * 0.12, 8)
      if (target > scrollVelocityRef.current) scrollVelocityRef.current = target
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {showCanvas && (
        <CanvasReveal
          starColor={starColor}
          baseOpacity={baseOpacity}
          showGradient={false}
          speedRef={scrollVelocityRef}
          tintRef={tintRef}
          active={spaceshipActive}
        />
      )}
    </div>
  )
}

function ProgressBarController() {
  const location = useLocation()

  useEffect(() => {
    gsap.set('.progress-bar', { height: '0%' })
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      gsap.set('.progress-bar', { height: `${progress * 100}%` })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return null
}

function HashScrollHandler() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)

    const attempt = () => {
      const el = document.getElementById(id)
      if (!el) return false
      if (window.__lenis) {
        window.__lenis.scrollTo(el, { offset: 0 })
      } else {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      return true
    }

    const t = setTimeout(() => {
      if (!attempt()) setTimeout(attempt, 400)
    }, 100)

    return () => clearTimeout(t)
  }, [pathname, hash])

  return null
}

// Persistent opaque layer between Canvas (z-index 0) and page content (z-index 2).
// Transparent on the homepage so the Canvas shows through; opaque everywhere else.
// This prevents the Canvas from flashing during AnimatePresence opacity transitions
// on pages that have their own background-color set.
function BackgroundOverlay() {
  const { pathname } = useLocation()
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: 'var(--bg)',
        opacity: pathname === '/' || pathname === '/about' || pathname === '/connect' || pathname.startsWith('/blog') || pathname === '/resume' || pathname.startsWith('/projects') ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    />
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const pageTransition = { duration: 0.35, ease: 'easeInOut' }

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={null}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<AboutFull />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [spaceshipActive, setSpaceshipActive] = useState(true)

  useLayoutEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      document.documentElement.classList.add('light-theme')
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <SpaceshipContext.Provider value={{ spaceshipActive, setSpaceshipActive }}>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CanvasBackground ready={!loading} spaceshipActive={spaceshipActive} />
      <BackgroundOverlay />

      <div className="progress-bar" aria-hidden="true">
        <div className="progress-bar__dot" />
      </div>

      <ProgressBarController />
      <HashScrollHandler />

      <AnimatePresence>
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!loading && (
        <>
          <AnimatedRoutes />
          <AmanBot />
        </>
      )}
    </BrowserRouter>
    </SpaceshipContext.Provider>
  )
}
