import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Footer from '../components/Footer'
import { ASSETS } from '../data/constants'
import '../styles/about-full.css'

gsap.registerPlugin(ScrollTrigger)

// Computed once at load - avoids repeated navigator reads inside components
const isLowEnd =
  (navigator.hardwareConcurrency ?? 8) <= 4 ||
  (navigator.deviceMemory ?? 8) < 4

// Exact from Hero.jsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.5 } },
}
const wordVariants = {
  hidden: { y: '110%', opacity: 0, skewY: 4 },
  visible: { y: '0%', opacity: 1, skewY: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}
const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

const CONTENT_SECTIONS = [
  {
    tag: '01: Origin',
    heading: 'Where It Started',
    text: 'I have been obsessed with computers since I was a kid. It started with gaming, then slowly turned into curiosity about what was actually happening behind the screen. Before I even finished high school I was teaching myself graphic design, video editing, and picking apart whatever software I could get my hands on. That curiosity never really switched off. I pursued a Bachelor of Computer Applications at GL Bajaj Institute, and somewhere in those three years it stopped being a hobby and became the thing I wanted to do with my life. I moved to Canada not because I had a plan, but because I wanted to be somewhere that would push me harder than I was pushing myself.',
  },
  {
    tag: '02: Past',
    heading: 'What Shaped Me',
    text: 'My bachelors gave me the foundation but it was cybersecurity that gave me a direction. I discovered during my degree that I genuinely enjoyed breaking things down to understand how they could fail, which is basically what security is. When I got to Durham College I leaned into that completely. The cybersecurity program changed how I think, not just about systems but about trust, risk, and the responsibility that comes with building things other people rely on. Somewhere in the middle of all that I also fell deep into AI, and it turned out the two fields have more in common than most people realise. Both are about understanding systems well enough to either protect them or improve them.',
  },
  {
    tag: '03: Present',
    heading: 'Right Now',
    text: 'I am finishing my dual post-graduate certificates in AI and Cybersecurity at Durham College and honestly it has been the most intense and rewarding stretch of my life. I spend most of my days either building something, breaking something, or reading about someone else building or breaking something. I am job hunting, working on projects that actually mean something to me, and trying to figure out how to turn everything I have learned into work that matters. It is a strange place to be, right at the edge of starting, but I would not trade it.',
  },
  {
    tag: '04: Future',
    heading: 'Where I Am Going',
    text: 'The next chapter is not really about a city or a job title. It is about being part of what is coming. AI is not a trend, it is a structural shift in how intelligence works, how systems are built, and how the world organises itself. Cybersecurity is going to matter more in that world, not less, because the more intelligent and connected systems become, the more there is at stake when they fail or get compromised. I want to be building at that intersection. Not just maintaining systems but shaping them. Contributing to research, working on problems that do not have clean answers yet, and eventually building something of my own that outlasts whatever role I happen to be in. The window between 2027 and 2037 is going to define a generation of builders. I intend to be one of them.',
  },
]

const TIMELINE = [
  {
    role: 'Marketing Assistant and Campus Tour Guide',
    company: 'Durham College',
    period: '2024 - Present',
    desc: 'Two roles that ended up teaching me more about people than technology. As a tour guide I walked hundreds of prospective students and families through campus, answered every question honestly, and tried to give them a real picture of what studying here actually looks like rather than a rehearsed sales pitch. The ambassador side was more behind the scenes, supporting recruitment events, coordinating outreach across the Durham Region, and helping the marketing team with whatever needed doing. It sounds simple but standing in front of a family who is deciding whether to move their kid across the world and being the person who helps them feel confident about that decision, that is not nothing.',
  },
  {
    role: 'Website Manager',
    company: 'Apex Supplements',
    period: '2023 - 2024',
    desc: 'Owned the website end to end. Product listings, content, SEO, performance, and making sure everything stayed aligned with whatever campaign the marketing team was running. It taught me that a good website is never really finished, it just gets better or worse depending on how much attention you give it.',
  },
  {
    role: 'Full Stack Developer',
    company: 'Mon Amour',
    period: '2023',
    desc: 'Built the whole platform from scratch. React on the front, Node and Express in the middle, MongoDB in the back. JWT authentication, cart, order history, admin dashboard for managing products and inventory. It was the first time I built something real that real people used, and that feeling of shipping something that works is still what I am chasing.',
  },
]

function ScrubbedText({ text, className }) {
  const containerRef = useRef(null)
  useEffect(() => {
    const words = containerRef.current?.querySelectorAll('.af-word')
    if (!words?.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(words,
              { opacity: 0.1, y: 8 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: 'power2.out', overwrite: true }
            )
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <p className={className} ref={containerRef} aria-label={text}>
      {text.split(' ').map((word, i, arr) => (
        <span key={i} className="af-word-wrapper">
          <span className="af-word" style={{ pointerEvents: 'none' }}>{word}</span>
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}

// Scroll-jacked expansion hero - rendered via portal to escape the App page-transition transform
function ScrollExpandHero({ onUnlock }) {
  const progress = useMotionValue(0)
  const progressRef = useRef(0)
  const [unlocked, setUnlocked] = useState(false)
  const [mounted, setMounted]   = useState(true)
  const prefersReducedMotion = useReducedMotion()
  const touchStartY      = useRef(null)
  const touchVelocityRef = useRef(0)
  const lastTouchTimeRef = useRef(0)
  const rafRef           = useRef(null)
  const unmountTimerRef  = useRef(null)
  const unlockTimeRef    = useRef(0)
  const unlockedRef      = useRef(false)
  const onWheelRef       = useRef(null)
  const sehRef           = useRef(null)

  // Cancel any in-flight momentum RAF on unmount
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  // ── Phase 1 transforms (clamp input to 1 so they freeze once Phase 2 begins) ──
  const bgOpacity      = useTransform(progress, [0, 0.8], [1, 0])
  // Background blur: sharp at 0, fully blurred at 1
  const bgBlur         = useTransform(progress, [0, 1], [0, 20])
  const bgFilter       = useTransform(bgBlur, v => `blur(${v}px) saturate(0.6) brightness(0.35)`)
  // Phase 1 visual transforms - clamped so they don't overshoot past progress=1
  const imgWidth       = useTransform(progress, p => 300 + Math.min(p, 1) * (window.innerWidth - 300))
  const imgHeight      = useTransform(progress, p => 400 + Math.min(p, 1) * (window.innerHeight - 400))
  const imgRadius      = useTransform(progress, p => Math.max(0, 16 * (1 - Math.min(p, 1))))
  const overlayOpacity = useTransform(progress, [0, 1], [0.5, 0])
  const amanX          = useTransform(progress, p => -Math.min(p, 1) * window.innerWidth * 0.25)
  const bansalX        = useTransform(progress, p =>  Math.min(p, 1) * window.innerWidth * 0.25)
  const cueOpacity     = useTransform(progress, [0, 0.2], [1, 0])
  // ── Phase 2 transform: hero slides upward off screen (progress 1 → 2) ──
  const heroY          = useTransform(progress, p => {
    if (p <= 1) return 0
    return -(p - 1) * window.innerHeight
  })

  // Stable ref so event-handler closures never go stale
  const doUnlock = useRef(null)
  doUnlock.current = () => {
    unlockedRef.current = true
    unlockTimeRef.current = Date.now()
    setUnlocked(true)

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const seh = document.querySelector('.seh')
    if (seh) {
      seh.style.display = 'none'
      seh.style.pointerEvents = 'none'
    }

    document.documentElement.style.height = ''
    document.documentElement.style.position = ''
    document.documentElement.style.touchAction = ''
    document.body.style.height = ''
    document.body.style.position = ''
    document.body.style.touchAction = ''

    if (isMobile) {
      setTimeout(() => {
        ScrollTrigger.refresh()
        document.documentElement.getBoundingClientRect()
      }, 150)
    }

    if (window.__lenis) {
      window.__lenis.start()
      window.__lenis.resize()
    }

    onUnlock?.()
  }

  // Unmount portal once hero has fully exited - removes mix-blend-mode stacking
  // context, filter paint layers, and all Framer Motion tracking overhead.
  // Re-mount immediately if the user scrolls back and triggers a re-collapse.
  useEffect(() => {
    if (!unlocked) { setMounted(true); return }
    const sehEl = document.querySelector('.seh')
    if (sehEl) {
      sehEl.style.touchAction = 'auto'
      sehEl.style.pointerEvents = 'none'
    }
    const t = setTimeout(() => setMounted(false), 0)
    return () => clearTimeout(t)
  }, [unlocked])

  // Allow re-collapsing on desktop: wheel scroll up at page top
  useEffect(() => {
    if (!unlocked) return
    const onBack = (e) => {
      if (Date.now() - unlockTimeRef.current < 1500) return
      if (window.scrollY <= 5 && e.deltaY < 0) {
        unlockedRef.current = false
        progressRef.current = 2
        progress.set(2)
        setUnlocked(false)
        window.__lenis?.stop()
      }
    }
    window.addEventListener('wheel', onBack, { passive: true })
    return () => window.removeEventListener('wheel', onBack)
  }, [unlocked])

  // Allow re-collapsing on mobile: swipe down at page top
  // Mirrors the wheel onBack logic above but for touch.
  useEffect(() => {
    if (!unlocked || isLowEnd || prefersReducedMotion) return

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY
    }

    const onTouchMove = (e) => {
      if (touchStartY.current === null) return
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY.current - touchY // negative = finger moving down

      // Chrome Android sometimes reports fractional scrollY or overscroll bounce
      // keeps scrollY > 0 even when visually at top - use 20px + fallbacks
      const isAtTop = window.scrollY <= 20 ||
        document.documentElement.scrollTop <= 20 ||
        document.body.scrollTop <= 20

      if (deltaY < -8 && isAtTop) {
        if (Date.now() - unlockTimeRef.current < 1500) return
        unlockedRef.current = false
        progressRef.current = 2
        progress.set(2)
        setMounted(true)
        setUnlocked(false)
        window.__lenis?.stop()
        touchStartY.current = touchY
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: true })

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [unlocked])

  // Main expansion + exit handler - progress range 0 → 2
  useEffect(() => {
    if (unlocked) return

    window.__lenis?.stop()

    const WHEEL_TOTAL = 500
    const MAX_DELTA   = 60

    const onWheel = (e) => {
      if (unlockedRef.current) return
      if (progressRef.current >= 2 && e.deltaY > 0) return
      if (progressRef.current <= 0 && e.deltaY < 0) return
      const capped = Math.max(-MAX_DELTA, Math.min(MAX_DELTA, e.deltaY))
      progressRef.current = Math.max(0, Math.min(2, progressRef.current + capped / WHEEL_TOTAL))
      progress.set(progressRef.current)
      if (progressRef.current >= 2) doUnlock.current()
    }

    const onTouchStart = (e) => {
      touchStartY.current     = e.touches[0].clientY
      lastTouchTimeRef.current = Date.now()
      touchVelocityRef.current = 0
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    }

    const onTouchMove = (e) => {
      if (touchStartY.current === null) return
      if (progressRef.current >= 2) return

      const touchY   = e.touches[0].clientY
      const now      = Date.now()
      const dt       = Math.max(1, now - lastTouchTimeRef.current)
      const rawDelta = touchStartY.current - touchY

      // Track velocity (px/ms) for momentum on liftoff
      touchVelocityRef.current = rawDelta / dt
      lastTouchTimeRef.current = now
      touchStartY.current      = touchY

      if (progressRef.current <= 0 && rawDelta < 0) return

      // Clamp max contribution per event - prevents fast swipe jumping too far
      const smoothDelta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 12) * 0.003
      progressRef.current = Math.max(0, Math.min(2, progressRef.current + smoothDelta))
      progress.set(progressRef.current)
      if (progressRef.current >= 2) doUnlock.current()
    }

    const onTouchEnd = () => {
      // Don't apply momentum if already at bounds or unlocked
      if (progressRef.current >= 2 || progressRef.current <= 0) return
      const velocity = touchVelocityRef.current
      if (Math.abs(velocity) < 0.05) return

      const applyMomentum = () => {
        touchVelocityRef.current *= 0.92
        const delta = touchVelocityRef.current * 3 * 0.003
        progressRef.current = Math.max(0, Math.min(2, progressRef.current + delta))
        progress.set(progressRef.current)

        if (progressRef.current >= 2) { doUnlock.current(); return }
        if (progressRef.current <= 0) return
        if (Math.abs(touchVelocityRef.current) > 0.01) {
          rafRef.current = requestAnimationFrame(applyMomentum)
        }
      }
      rafRef.current = requestAnimationFrame(applyMomentum)
    }

    onWheelRef.current = onWheel
    window.addEventListener('wheel',      onWheel,      { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: true })
    window.addEventListener('touchend',   onTouchEnd,   { passive: true })

    return () => {
      onWheelRef.current = null
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('touchend',   onTouchEnd)
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    }
  }, [unlocked])

  // Prevent native scroll while the hero is active - passive:false allows preventDefault
  useEffect(() => {
    if (unlocked || !mounted) return
    const el = sehRef.current
    if (!el) return
    const prevent = (e) => e.preventDefault()
    el.addEventListener('wheel', prevent, { passive: false })
    return () => el.removeEventListener('wheel', prevent)
  }, [unlocked, mounted])

  const node = (
    <motion.section
      ref={sehRef}
      className="seh"
      style={{ y: heroY, pointerEvents: unlocked ? 'none' : 'auto', touchAction: unlocked ? 'auto' : 'none' }}
      aria-label="About Aman Bansal"
    >
      {/* 1. Background - fades in first with a gentle de-zoom */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.07 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'absolute', inset: 0 }}
        aria-hidden="true"
      >
        <motion.div className="seh__bg" style={{ opacity: bgOpacity }}>
          <motion.img
            src={ASSETS.bgAvatar}
            onError={(e) => { e.currentTarget.src = ASSETS.avatar }}
            alt=""
            loading="eager"
            style={{ filter: bgFilter }}
          />
        </motion.div>
      </motion.div>

      {/* 2. Portrait - rises from below with a light scale-up */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 52, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="seh__img-wrap"
          style={{ width: imgWidth, height: imgHeight, borderRadius: imgRadius }}
          aria-hidden="true"
        >
          <motion.div className="seh__overlay" style={{ opacity: overlayOpacity }} />
          <img src={ASSETS.avatar} alt="" loading="eager" />
        </motion.div>
      </motion.div>

      {/* 3. Name - words slide up with stagger and a kinetic skew */}
      <div className="seh__title" aria-label="Aman Bansal">
        <motion.span
          className="seh__word"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 36, skewY: 5 }}
          animate={{ opacity: 1, y: 0, skewY: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: amanX }}
          aria-hidden="true"
        >Aman</motion.span>
        <motion.span
          className="seh__word"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 36, skewY: 5 }}
          animate={{ opacity: 1, y: 0, skewY: 0 }}
          transition={{ duration: 0.9, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: bansalX }}
          aria-hidden="true"
        >Bansal</motion.span>
      </div>

      {/* Scroll cue */}
      <motion.div className="seh__cue" style={{ opacity: cueOpacity }} aria-hidden="true">
        <span className="seh__cue-text">Scroll to explore</span>
        <motion.div
          className="seh__cue-arrow"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
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
      </motion.div>
    </motion.section>
  )

  if (!mounted) return null
  return createPortal(node, document.body)
}

export default function AboutFull() {
  const [menuOpen, setMenuOpen]     = useState(false)
  const [heroUnlocked, setHeroUnlocked] = useState(false)
  const prefersReducedMotion        = useReducedMotion()
  const timelineRef                 = useRef(null)
  const entryRefs                   = useRef([])
  const lenisRef                    = useRef(null)

  useEffect(() => {
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (!isMobile) return

    if (window.__lenis) {
      window.__lenis.stop()
    }

    gsap.ticker.sleep()

    document.documentElement.style.overflowY = 'auto'
    document.body.style.overflowY = 'auto'
    document.documentElement.style.position = ''
    document.body.style.position = ''

    return () => {
      gsap.ticker.wake()
      if (window.__lenis) {
        window.__lenis.start()
      }
    }
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  // Prevent Chrome Android pull-to-refresh and overscroll bounce for the
  // entire about page lifecycle - does not affect native scroll momentum
  useEffect(() => {
    document.documentElement.style.overscrollBehavior = 'none'
    document.body.style.overscrollBehavior = 'none'
    return () => {
      document.documentElement.style.overscrollBehavior = ''
      document.body.style.overscrollBehavior = ''
    }
  }, [])

  useEffect(() => {
    if (!heroUnlocked) return

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true,
      touchMultiplier: 2,
    })
    lenisRef.current = lenis
    window.__lenis = lenis

    const rafFn = (time) => { lenis.raf(time * 1000) }
    lenis.on('scroll', () => { ScrollTrigger.update() })
    gsap.ticker.add(rafFn)
    gsap.ticker.lagSmoothing(0)

    const t = setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      clearTimeout(t)
      gsap.ticker.remove(rafFn)
      lenis.destroy()
      window.__lenis = null
    }
  }, [heroUnlocked])

  useEffect(() => {
    if (!heroUnlocked) return

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (!isMobile) return

    const forceScrollable = () => {
      document.documentElement.style.overflowY = 'auto'
      document.body.style.overflowY = 'auto'
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' &&
            mutation.attributeName === 'style') {
          const el = mutation.target
          const computed = getComputedStyle(el)
          if (computed.overflowY === 'hidden' ||
              computed.overflow === 'hidden') {
            forceScrollable()
          }
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    })

    forceScrollable()
    const t1 = setTimeout(forceScrollable, 100)
    const t2 = setTimeout(forceScrollable, 300)
    const t3 = setTimeout(forceScrollable, 500)

    const t4 = setTimeout(() => {
      observer.disconnect()
    }, 2000)

    return () => {
      observer.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [heroUnlocked])

  // Timeline scroll-in - IntersectionObserver to avoid Lenis/ScrollTrigger conflict on mobile
  useEffect(() => {
    const entries = entryRefs.current.filter(Boolean)
    if (!entries.length) return
    const observer = new IntersectionObserver(
      (observations) => {
        observations.forEach((obs) => {
          if (obs.isIntersecting) {
            gsap.fromTo(obs.target,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
            )
          } else {
            gsap.to(obs.target, { opacity: 0, y: 30, duration: 0.4 })
          }
        })
      },
      { threshold: 0.2 }
    )
    entries.forEach((entry) => observer.observe(entry))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <ScrollExpandHero onUnlock={() => setHeroUnlocked(true)} />

      <Navbar onMenuToggle={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />

      <AnimatePresence>
        {menuOpen && (
          <MenuOverlay onClose={() => setMenuOpen(false)} scrollTo={() => setMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* Back link - fixed above the hero at all times */}
      <motion.div
        className="af-back-btn"
        variants={fadeUpVariants}
        initial={prefersReducedMotion ? false : 'hidden'}
        animate="visible"
        custom={0.4}
      >
        <Link to="/" className="af-back__link">← Home</Link>
      </motion.div>

      <main className="af-main">

        {/* ── Intro strip ────────────────────────────────── */}
        <section className="af-intro" aria-label="Introduction">
          <div className="af-intro__inner">
            <motion.p
              className="af-intro__tag"
              {...(!prefersReducedMotion ? {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.5 },
                transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
              } : {})}
            >
              Full-Stack Developer · AI Engineer · Cybersecurity
            </motion.p>
            <motion.p
              className="af-intro__location"
              {...(!prefersReducedMotion ? {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.5 },
                transition: { duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
              } : {})}
            >
              Oshawa, ON · Canada
            </motion.p>
            <motion.p
              className="af-intro__bio"
              {...(!prefersReducedMotion ? {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.5 },
                transition: { duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
              } : {})}
            >
              I got into software because I liked making things. Turns out I also like breaking things, which is probably why I ended up in cybersecurity too. These days I split my time between AI projects, full-stack work, and trying to keep up with a world that is moving faster than anyone expected. With every major company racing toward whatever comes next in AI, there is genuinely too much to learn and not enough hours, but that is the part I find exciting. Still figuring out where I fit in all of it.
            </motion.p>
          </div>
        </section>

        {/* ── Story sections ─────────────────────────────── */}
        {CONTENT_SECTIONS.map(({ tag, heading, text }, i) => (
          <section
            key={tag}
            className={`af-section${i % 2 === 1 ? ' af-section--right' : ''}`}
            aria-label={heading}
          >
            <div className="af-section__inner">
              <motion.span
                className="af-section__tag"
                {...(!prefersReducedMotion ? {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.5 },
                  transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                } : {})}
              >
                {tag}
              </motion.span>

              <div className="af-section__heading-line">
                <motion.h2
                  className="af-section__heading"
                  {...(!prefersReducedMotion ? {
                    initial: { y: '110%', opacity: 0, skewY: 4 },
                    whileInView: { y: '0%', opacity: 1, skewY: 0 },
                    viewport: { once: true, amount: 0.5 },
                    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                  } : {})}
                >
                  {heading}
                </motion.h2>
              </div>

              <ScrubbedText text={text} className="af-section__text" />
            </div>
          </section>
        ))}

        {/* ── Experience timeline ─────────────────────────── */}
        <section className="af-timeline" ref={timelineRef} aria-label="Experience timeline">
          <div className="af-timeline__inner">
            <motion.span
              className="af-timeline__tag"
              {...(!prefersReducedMotion ? {
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.5 },
                transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
              } : {})}
            >
              05: Experience
            </motion.span>

            <div className="af-timeline__heading-line">
              <motion.h2
                className="af-timeline__heading"
                {...(!prefersReducedMotion ? {
                  initial: { y: '110%', opacity: 0, skewY: 4 },
                  whileInView: { y: '0%', opacity: 1, skewY: 0 },
                  viewport: { once: true, amount: 0.5 },
                  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
                } : {})}
              >
                Experience
              </motion.h2>
            </div>

            <div className="af-timeline__list">
              {TIMELINE.map(({ role, company, period, desc }, i) => (
                <div
                  key={company}
                  className="af-timeline__entry"
                  ref={(el) => { entryRefs.current[i] = el }}
                >
                  <span className="af-timeline__period">{period}</span>
                  <div>
                    <div className="af-timeline__role">{role}</div>
                    <div className="af-timeline__company">{company}</div>
                    <p className="af-timeline__desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
