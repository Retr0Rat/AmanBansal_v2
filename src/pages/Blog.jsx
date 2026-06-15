import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '../components/Navbar'
import MenuOverlay from '../components/MenuOverlay'
import Footer from '../components/Footer'
import { BLOGS } from '../data/blogs'
import '../styles/blog.css'

gsap.registerPlugin(ScrollTrigger)

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

const CATEGORIES = ['All', 'AI', 'Cybersecurity', 'Markets', 'Geopolitics', 'Tech']

const featuredPost = BLOGS.find((b) => b.featured)
const gridPosts = BLOGS.filter((b) => !b.featured)

export default function Blog() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const prefersReducedMotion = useReducedMotion()
  const gridRef = useRef(null)
  const cardRefs = useRef([])

  const showFeatured = !!featuredPost && (activeCategory === 'All' || featuredPost.category === activeCategory)
  const visibleGrid = activeCategory === 'All' ? gridPosts : gridPosts.filter((p) => p.category === activeCategory)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        cardRefs.current.forEach((card) => {
          if (!card) return
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        })
      }, gridRef)

      return () => ctx.revert()
    })

    return () => mm.revert()
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

      <main className="blog-main">
        <div className="blog__back">
          <motion.div
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0}
          >
            <Link to="/" className="blog__back-link">← Home</Link>
          </motion.div>
        </div>

        <div className="blog__header">
          <motion.span
            className="blog__tag"
            variants={fadeUpVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            custom={0.3}
          >
            Writing
          </motion.span>

          <motion.div
            className="blog__heading-line"
            variants={containerVariants}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
          >
            <div style={{ overflow: 'hidden' }}>
              <motion.h1 className="blog__heading" variants={wordVariants}>
                The Blog
              </motion.h1>
            </div>
          </motion.div>
        </div>

        {/* Category filters */}
        <motion.div
          className="blog__filters"
          {...(prefersReducedMotion ? {} : {
            initial: 'hidden',
            animate: 'visible',
            variants: {
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.8 } },
            },
          })}
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              className={`blog__filter-btn${activeCategory === cat ? ' blog__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              {...(prefersReducedMotion ? {} : {
                variants: {
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                },
              })}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Featured post */}
        {showFeatured && (
          <div className="blog__featured">
            <motion.div
              variants={fadeUpVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate="visible"
              custom={1.0}
            >
              <Link to={`/blog/${featuredPost.slug}`} className="blog__featured-inner">
                <div className="blog__featured-img">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    width={800}
                    height={500}
                    loading="eager"
                  />
                </div>
                <div className="blog__featured-meta">
                  <span className="blog__featured-category">{featuredPost.category}, Featured</span>
                  <h2 className="blog__featured-title">{featuredPost.title}</h2>
                  <p className="blog__featured-excerpt">{featuredPost.excerpt}</p>
                  <span className="blog__featured-cta">Read Post →</span>
                </div>
              </Link>
            </motion.div>
          </div>
        )}

        {/* Grid */}
        <div className="blog__grid-section" ref={gridRef}>
          <div className="blog__grid">
            {visibleGrid.map((post, i) => (
              <div
                key={post.slug}
                className="blog__card-wrap"
                ref={(el) => { cardRefs.current[i] = el }}
              >
                <Link to={`/blog/${post.slug}`} className="blog__card">
                  <div className="blog__card-img">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      width={600}
                      height={450}
                      loading="lazy"
                    />
                  </div>
                  <p className="blog__card-category">{post.category}</p>
                  <h3 className="blog__card-title">{post.title}</h3>
                  <p className="blog__card-excerpt">{post.excerpt}</p>
                  <p className="blog__card-date">{post.date}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  )
}
