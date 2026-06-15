import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { CONTACT } from '../data/constants'
import '../styles/cta.css'

const MotionLink = motion.create(Link)

const BLOCKS = [
  {
    id: 'email',
    heading: "Let's Build\nSomething",
    sub: 'Open to full-time roles & freelance',
    cta: 'Send a Message',
    href: `mailto:${CONTACT.email}`,
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&fm=webp',
    external: false,
  },
  {
    id: 'blog',
    heading: 'Explore\nMy Work',
    sub: 'AI, security, markets & more',
    cta: 'Read the Blog',
    href: '/blog',
    img: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&fm=webp',
    external: false,
    internal: true,
  },
]

const SLIDE_TRANSITION = { duration: 1.1, ease: [0.16, 1, 0.3, 1] }

function CTABlock({ block, prefersReducedMotion }) {
  const [hovered, setHovered] = useState(false)
  const btnRef = useRef(null)

  const btnX = useMotionValue(0)
  const btnY = useMotionValue(0)
  const springBtnX = useSpring(btnX, { stiffness: 150, damping: 15 })
  const springBtnY = useSpring(btnY, { stiffness: 150, damping: 15 })

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || isTouch || !btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    btnX.set((e.clientX - cx) * 0.3)
    btnY.set((e.clientY - cy) * 0.3)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    btnX.set(0)
    btnY.set(0)
  }

  const sharedProps = {
    className: 'cta-block',
    onMouseEnter: () => setHovered(true),
    onMouseLeave: handleMouseLeave,
    onMouseMove: handleMouseMove,
    'aria-label': block.cta,
  }

  const Wrapper = block.internal ? MotionLink : motion.a
  const wrapperProps = block.internal
    ? { to: block.href, ...sharedProps }
    : { href: block.href, target: block.external ? '_blank' : undefined, rel: block.external ? 'noopener noreferrer' : undefined, ...sharedProps }

  return (
    <Wrapper {...wrapperProps}>
      <motion.div
        className="cta-block__bg"
        animate={{ scale: prefersReducedMotion ? 1 : (hovered ? 1 : 1.05) }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <img src={block.img} alt="" width={800} height={600} loading="lazy" />
      </motion.div>

      <div className="cta-block__content">
        <h2 className="cta-block__heading">
          {block.heading.split('\n').map((line, i, arr) => (
            <span key={i} className="cta-block__heading-line">
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <p className="cta-block__sub">{block.sub}</p>

        <motion.div
          ref={btnRef}
          className="cta-block__btn"
          style={prefersReducedMotion ? undefined : { x: springBtnX, y: springBtnY }}
        >
          <span>{block.cta}</span>
          <span className="cta-block__arrow" aria-hidden="true">→</span>
        </motion.div>
      </div>

      <motion.div
        className="cta-block__border"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      />
    </Wrapper>
  )
}

export default function CTABlocks() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="cta" className="cta-section" aria-label="Call to action">
      <div className="cta-section__header">
        <motion.span
          className="cta-section__tag"
          {...(prefersReducedMotion ? {} : {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: false, amount: 0.5 },
            transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
          })}
        >
          04: Connect
        </motion.span>
      </div>
      <div className="cta-section__grid">
        <motion.div
          {...(prefersReducedMotion ? {} : {
            initial: { opacity: 0, x: -40 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: false, amount: 0.3 },
            transition: SLIDE_TRANSITION,
          })}
        >
          <CTABlock block={BLOCKS[0]} prefersReducedMotion={prefersReducedMotion} />
        </motion.div>
        <motion.div
          {...(prefersReducedMotion ? {} : {
            initial: { opacity: 0, x: 40 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: false, amount: 0.3 },
            transition: SLIDE_TRANSITION,
          })}
        >
          <CTABlock block={BLOCKS[1]} prefersReducedMotion={prefersReducedMotion} />
        </motion.div>
      </div>
    </section>
  )
}
