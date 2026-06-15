import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../data/projects'
import '../styles/projects.css'

export default function Projects() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const rowRefs = useRef([])
  const [hoveredId, setHoveredId] = useState(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.5 })

  const idSlide = prefersReducedMotion ? {} : {
    initial: { y: '100%', opacity: 0 },
    animate: { y: '0%', opacity: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
    exit:    { y: '-100%', opacity: 0, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
  }

  useEffect(() => {
    if (prefersReducedMotion) return
    const handleMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY, prefersReducedMotion])

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        rowRefs.current.forEach((row, i) => {
          if (!row) return
          gsap.fromTo(
            row,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'expo.out',
              delay: i * 0.1,
              scrollTrigger: {
                trigger: row,
                start: 'top 75%',
                toggleActions: 'play none play reverse',
              },
            }
          )
        })
      }, sectionRef)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="projects" className="projects" ref={sectionRef} aria-label="Projects section">
      <div className="projects__header">
        <span className="projects__tag">02: Selected Work</span>
        <span className="projects__count">{PROJECTS.length} Projects</span>
      </div>

      <div className="projects__inner">
        <div className="projects__list" role="list">
          {PROJECTS.map((project, i) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="project-row"
              ref={el => { rowRefs.current[i] = el }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`View ${project.title} project details`}
            >
              <div className="project-row__inner">
                <div className="project-row__id-wrapper" aria-hidden="true">
                  <AnimatePresence mode="wait" initial={false}>
                    {hoveredId === project.id ? (
                      <motion.span key="arrow" className="project-row__id project-row__id--arrow" {...idSlide}>
                        →
                      </motion.span>
                    ) : (
                      <motion.span key="num" className="project-row__id" {...idSlide}>
                        {project.id}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="project-row__content">
                  <h3 className="project-row__title">{project.title}</h3>
                  <p className="project-row__desc">{project.description}</p>
                </div>

                <div className="project-row__right">
                  <span className="project-row__stack">{project.stack.join(' · ')}</span>
                  <span className="project-row__year">{project.year}</span>
                </div>
              </div>

              <div className="project-row__divider" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <div className="projects__footer-row">
          <div className="projects__footer-line" aria-hidden="true" />
          <Link to="/projects" className="projects__more-btn">
            More Projects →
          </Link>
        </div>
      </div>

      {!prefersReducedMotion && (
        <motion.div
          className="projects__cursor-img"
          style={{ left: springX, top: springY, x: '-50%', y: '-50%' }}
          aria-hidden="true"
        >
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              className="projects__cursor-img-inner"
              initial={false}
              animate={{
                opacity: hoveredId === project.id ? 1 : 0,
                scale: hoveredId === project.id ? 1 : 0.85,
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={project.previewImage} alt={project.title} width={300} height={200} loading="lazy" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
