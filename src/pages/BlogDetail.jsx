import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Footer from '../components/Footer'
import { BLOGS } from '../data/blogs'
import '../styles/blog-detail.css'

gsap.registerPlugin(ScrollTrigger)

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

export default function BlogDetail() {
  const { slug } = useParams()
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const paraRefs = useRef([])
  const bodyRef = useRef(null)

  const index = BLOGS.findIndex((b) => b.slug === slug)
  const post = BLOGS[index]
  const prevPost = index > 0 ? BLOGS[index - 1] : null
  const nextPost = index < BLOGS.length - 1 ? BLOGS[index + 1] : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        paraRefs.current.forEach((para) => {
          if (!para) return
          gsap.fromTo(
            para,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: para,
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        })
      }, bodyRef)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [slug])

  if (!post) {
    return (
      <div style={{ padding: '10rem 2.5rem', color: 'var(--text)' }}>
        Post not found. <Link to="/blog" style={{ color: 'var(--grey)' }}>← Back to Blog</Link>
      </div>
    )
  }

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

      <main className="bd-main">
        <div className="bd__back">
          <motion.div
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0}
          >
            <Link to="/blog" className="bd__back-link">← Blog</Link>
          </motion.div>
        </div>

        <header className="bd__header">
          <motion.div
            className="bd__meta"
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.3}
          >
            <span className="bd__category">{post.category}</span>
            <span className="bd__date">{post.date}</span>
          </motion.div>

          <div className="bd__title-line">
            <motion.h1
              className="bd__title"
              variants={wordVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
            >
              {post.title}
            </motion.h1>
          </div>
        </header>

        <div className="bd__cover">
          <motion.img
            src={post.coverImage}
            alt={post.title}
            width={900}
            height={506}
            loading="eager"
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.6}
          />
        </div>

        <div className="bd__body" ref={bodyRef}>
          {post.body.map((para, i) => (
            <p
              key={i}
              className="bd__paragraph"
              ref={(el) => { paraRefs.current[i] = el }}
            >
              {para}
            </p>
          ))}
        </div>

        <nav className="bd__nav" aria-label="Post navigation">
          {prevPost ? (
            <Link to={`/blog/${prevPost.slug}`} className="bd__nav-link bd__nav-link--prev">
              <span className="bd__nav-label">← Previous</span>
              <span className="bd__nav-title">{prevPost.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link to={`/blog/${nextPost.slug}`} className="bd__nav-link bd__nav-link--next">
              <span className="bd__nav-label">Next →</span>
              <span className="bd__nav-title">{nextPost.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>

      <Footer />
    </motion.div>
  )
}
