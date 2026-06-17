import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AvatarHover from './AvatarHover'
import { CONTACT } from '../data/constants'
import '../styles/footer.css'

const MotionLink = motion.create(Link)

const LINKS = [
  { label: 'GitHub', href: CONTACT.github, external: true },
  { label: 'Resume', href: '/resume', external: false },
  { label: 'Connect', href: '/connect', external: false },
]

const EASE = [0.16, 1, 0.3, 1]

export default function Footer() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__inner">
        <div className="footer__top">
          <motion.div
            {...(prefersReducedMotion ? {} : {
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: false, amount: 0.5 },
              transition: { duration: 1.1, ease: EASE },
            })}
          >
            <AvatarHover>
              <div className="footer__brand">
                <span className="footer__logo">AB</span>
                <span className="footer__name">Aman Bansal</span>
              </div>
            </AvatarHover>
          </motion.div>

          <nav className="footer__links" aria-label="Footer navigation">
            {LINKS.map(({ label, href, external }, i) => {
              const motionProps = {
                className: 'footer__link',
                whileHover: prefersReducedMotion ? undefined : { x: 4 },
                'aria-label': label,
                ...(prefersReducedMotion ? {} : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: false, amount: 0.5 },
                  transition: { duration: 1.1, ease: EASE, delay: i * 0.1 },
                }),
              }
              return external ? (
                <motion.a
                  key={label}
                  {...motionProps}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                  <span className="footer__link-arrow" aria-hidden="true">↗</span>
                </motion.a>
              ) : (
                <MotionLink
                  key={label}
                  {...motionProps}
                  to={href}
                >
                  {label}
                  <span className="footer__link-arrow" aria-hidden="true">↗</span>
                </MotionLink>
              )
            })}
          </nav>
        </div>

        <div className="footer__divider" aria-hidden="true" />

        <div className="footer__bottom">
          {[
            `© ${new Date().getFullYear()} Aman Bansal. All rights reserved.`,
            'Full-Stack Developer · AI Engineer · Cybersecurity Specialist',
            'Oshawa, ON · Canada',
          ].map((text, i) => (
            <motion.p
              key={i}
              className={
                i === 0 ? 'footer__copy'
                : i === 1 ? 'footer__tagline'
                : 'footer__location'
              }
              {...(prefersReducedMotion ? {} : {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: false, amount: 0.5 },
                transition: { duration: 1.1, ease: EASE, delay: i * 0.1 },
              })}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </footer>
  )
}
