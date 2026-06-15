import { motion, useReducedMotion } from 'framer-motion'

export default function Preloader() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeInOut' }}
    >
      <motion.span
        className="preloader__text"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        AB
      </motion.span>
    </motion.div>
  )
}
