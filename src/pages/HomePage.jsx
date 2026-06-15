import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Hero from '../components/Hero'

const About = lazy(() => import('../components/About'))
const Projects = lazy(() => import('../components/Projects'))
const Skills = lazy(() => import('../components/Skills'))
const CTABlocks = lazy(() => import('../components/CTABlocks'))
const Footer = lazy(() => import('../components/Footer'))

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const lenisRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
    })
    lenisRef.current = lenis
    window.__lenis = lenis

    const rafFn = (time) => { lenis.raf(time * 1000) }

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })
    gsap.ticker.add(rafFn)
    gsap.ticker.lagSmoothing(0)

    setTimeout(() => ScrollTrigger.refresh(), 300)

    return () => {
      gsap.ticker.remove(rafFn)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  useEffect(() => {
    if (menuOpen) {
      lenisRef.current?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenisRef.current?.start()
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const scrollTo = (id) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) lenisRef.current?.scrollTo(el, { offset: -80 })
    }, 600)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Navbar onMenuToggle={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />

        <AnimatePresence>
          {menuOpen && (
            <MenuOverlay onClose={() => setMenuOpen(false)} scrollTo={scrollTo} />
          )}
        </AnimatePresence>

        <main>
          <Hero scrollTo={scrollTo} />
          <Suspense fallback={null}>
            <About />
            <Projects />
            <Skills />
            <CTABlocks />
            <Footer />
          </Suspense>
        </main>
      </motion.div>
    </>
  )
}
