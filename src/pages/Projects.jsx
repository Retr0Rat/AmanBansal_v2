import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Footer from '../components/Footer'
import { PROJECTS } from '../data/projects'
import '../styles/projects-page.css'

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

const bentoContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cellVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

// Pattern repeats every 7 projects:
// indexes 0,1 → row 1 (7+5 = 12 cols)
// indexes 2,3,4 → row 2 (4+4+4 = 12 cols)
// indexes 5,6 → row 3 (5+7 = 12 cols)
const getCellConfig = (index) => {
  const pos = index % 7
  const configs = [
    { cols: 7, height: 280, size: 'big'   },
    { cols: 5, height: 280, size: 'med'   },
    { cols: 4, height: 200, size: 'small' },
    { cols: 4, height: 200, size: 'small' },
    { cols: 4, height: 200, size: 'small' },
    { cols: 5, height: 200, size: 'med'   },
    { cols: 7, height: 200, size: 'wide'  },
  ]
  return configs[pos]
}

const MotionLink = motion(Link)

export default function Projects() {
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion    = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

      <main className="pp-main">
        {/* Back */}
        <div className="pp-back">
          <motion.div
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0}
          >
            <Link to="/" className="pp-back-link">← Home</Link>
          </motion.div>
        </div>

        {/* Header */}
        <div className="pp-header">
          <motion.span
            className="pp-tag"
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.3}
          >
            03: Projects
          </motion.span>

          <motion.div
            className="pp-heading-line"
            variants={containerVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
          >
            <div style={{ overflow: 'hidden' }}>
              <motion.h1 className="pp-heading" variants={wordVariants}>
                All Work
              </motion.h1>
            </div>
          </motion.div>

          <motion.p
            className="pp-subtext"
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.9}
          >
            Every project, start to finish.
          </motion.p>
        </div>

        {/* Bento grid
            Auto-adapts via getCellConfig(index).
            To add a project: add to src/data/projects.js only.
            Layout pattern repeats every 7 projects automatically. */}
        <div className="pp-bento-section">
          <motion.div
            className="pp-bento"
            variants={bentoContainerVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {PROJECTS.map((project, index) => {
              const config   = getCellConfig(index)
              const isWide   = config.size === 'wide'
              const isBig    = config.size === 'big'
              const hasImage = !!project.previewImage

              return (
                <MotionLink
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  className={`pp-cell pp-cell--${config.size}${!hasImage ? ' pp-cell--no-image' : ''}`}
                  style={{ gridColumn: `span ${config.cols}`, height: `${config.height}px` }}
                  variants={prefersReducedMotion ? {} : cellVariants}
                  aria-label={`View ${project.title}`}
                >
                  {hasImage && (
                    <>
                      <img
                        className="pp-cell__img"
                        src={project.previewImage}
                        alt=""
                        loading={isBig ? 'eager' : 'lazy'}
                      />
                      <div className="pp-cell__overlay" aria-hidden="true" />
                    </>
                  )}

                  <div className="pp-cell__content">
                    <div className="pp-cell__meta">
                      <span className="pp-cell__num">{project.id}</span>
                      <span className="pp-cell__year">{project.year}</span>
                    </div>
                    <h2 className="pp-cell__title">{project.title}</h2>
                    {isBig && hasImage && (
                      <p className="pp-cell__desc">{project.description}</p>
                    )}
                    <div className="pp-cell__stack">
                      {project.stack.slice(0, isBig ? 5 : 3).map((tag) => (
                        <span key={tag} className="pp-cell__pill">{tag}</span>
                      ))}
                    </div>
                  </div>
                </MotionLink>
              )
            })}
          </motion.div>
        </div>
      </main>

      <Footer />
    </motion.div>
  )
}
