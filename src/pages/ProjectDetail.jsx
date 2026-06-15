import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight } from 'lucide-react'
import { PROJECTS } from '../data/projects'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Footer from '../components/Footer'
import '../styles/ProjectDetail.css'

gsap.registerPlugin(ScrollTrigger)

// Exact copies from Hero.jsx
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

export default function ProjectDetail() {
  const { slug } = useParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openVersion, setOpenVersion] = useState(null)
  const prefersReducedMotion = useReducedMotion()
  const tagsRef = useRef(null)
  const sectionRefs = useRef([])
  const mainRef = useRef(null)

  const project = PROJECTS.find((p) => p.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    setOpenVersion(null)
  }, [slug])

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // Stack tags - About.jsx stats pattern, on mount with delay after title
        if (tagsRef.current) {
          gsap.fromTo(
            tagsRef.current.querySelectorAll('.pd-hero__tag'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 1.0 }
          )
        }

        // Content sections - About.jsx stats ScrollTrigger pattern, section-level
        sectionRefs.current.forEach((el) => {
          if (!el) return
          gsap.fromTo(
            el,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        })
      }, mainRef)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [slug])

  if (!project) {
    return (
      <>
        <Navbar onMenuToggle={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />
        <div className="pd-not-found">Project not found.</div>
        <Footer />
      </>
    )
  }

  return (
    <motion.div
      key={slug}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Navbar onMenuToggle={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />

      <AnimatePresence>
        {menuOpen && (
          <MenuOverlay
            onClose={() => setMenuOpen(false)}
            scrollTo={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <main className="pd-main" ref={mainRef}>
        <div className="pd-back">
          <motion.div
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0}
          >
            <Link to="/#projects" className="pd-back__link">← All Projects</Link>
          </motion.div>
        </div>

        <section className="pd-hero">
          <motion.div
            className="pd-hero__meta"
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.2}
          >
            <span className="pd-hero__id">{project.id}</span>
            <span className="pd-hero__year">{project.year}</span>
          </motion.div>

          {/* overflow: hidden wrapper clips the slide-up - same as .hero__title-line */}
          <div className="pd-hero__title-line">
            <motion.h1
              className="pd-hero__title"
              variants={wordVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
            >
              {project.title}
            </motion.h1>
          </div>

          {/* GSAP stagger on mount - About.jsx stats pattern */}
          <div className="pd-hero__stack" ref={tagsRef}>
            {project.stack.map((tag) => (
              <span key={tag} className="pd-hero__tag">{tag}</span>
            ))}
          </div>

          <motion.p
            className="pd-hero__description"
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={1.2}
          >
            {project.description}
          </motion.p>

          {(project.liveUrl || project.githubUrl || project.slug === 'insightboard') && (
            <motion.div
              className="pd-hero__links"
              variants={fadeUpVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              custom={1.4}
            >
              {project.slug === 'insightboard' ? (
                // TODO: Replace liveUrl in projects.js with real Tableau Public link after publishing
                <a
                  href={project.liveUrl || 'https://public.tableau.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-btn pd-btn--primary"
                >
                  Explore Dashboard ↗
                </a>
              ) : (
                <>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pd-btn pd-btn--primary"
                    >
                      Live Demo ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pd-btn pd-btn--secondary"
                    >
                      GitHub ↗
                    </a>
                  )}
                </>
              )}
            </motion.div>
          )}
        </section>

        <div className="pd-preview">
          <img
            src={project.previewImage}
            alt={project.title}
            width={1200}
            height={675}
            loading="eager"
          />
        </div>

        <div className="pd-sections">
          {[
            { label: 'Problem', body: project.problem },
            { label: 'Approach', body: project.approach },
            { label: 'Outcome', body: project.outcome },
          ].map(({ label, body }, i) => (
            <section
              key={label}
              className="pd-section"
              ref={(el) => { sectionRefs.current[i] = el }}
            >
              <div className="pd-section__label">{label}</div>
              <div className="pd-section__content">
                <p>{body}</p>
              </div>
            </section>
          ))}
        </div>

        {project.versions?.length > 0 && (
          <div className="pd-versions">
            <div className="pd-versions__heading">Version History</div>
            <div className="pd-versions__list">
              {project.versions.map((v, i) => {
                const isOpen = openVersion === i
                return (
                  <div key={v.version} className="pd-version">
                    <button
                      className="pd-version__row"
                      onClick={() => setOpenVersion(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`pd-version-body-${i}`}
                    >
                      <span className="pd-version__num">{v.version}</span>
                      <span className="pd-version__title">{v.title}</span>
                      <span className="pd-version__date">{v.date}</span>
                      <motion.span
                        className="pd-version__chevron"
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
                        }
                        aria-hidden="true"
                      >
                        <ChevronRight size={14} strokeWidth={1.5} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`pd-version-body-${i}`}
                          className="pd-version__body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                          }
                        >
                          <p className="pd-version__desc">{v.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="pd-version__divider" aria-hidden="true" />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </motion.div>
  )
}
