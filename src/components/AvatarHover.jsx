import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ASSETS } from '../data/constants'
import '../styles/avatar.css'

export default function AvatarHover({ children, direction = 'above' }) {
  const [hovered, setHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const circleRef = useRef(null)

  // Exact magnetic spring values from CTABlocks.jsx
  const circleX = useMotionValue(0)
  const circleY = useMotionValue(0)
  const springX = useSpring(circleX, { stiffness: 150, damping: 15 })
  const springY = useSpring(circleY, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !circleRef.current) return
    const rect = circleRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    circleX.set((e.clientX - cx) * 0.3)
    circleY.set((e.clientY - cy) * 0.3)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    circleX.set(0)
    circleY.set(0)
  }

  return (
    <div
      className="avatar-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div
            ref={circleRef}
            className={`avatar-circle avatar-circle--${direction}`}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.7 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
            aria-hidden="true"
          >
            <img src={ASSETS.avatar} alt="" width={200} height={200} loading="lazy" />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  )
}
