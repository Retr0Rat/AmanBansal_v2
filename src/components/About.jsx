import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/about.css'
import CoffeeCup from './CoffeeCup'

const STATS = [
  { value: '6+', label: 'Projects Shipped' },
  { value: '95.6%', label: 'F1-Score on Fraud Model' },
  { value: '3', label: 'Cloud Platforms' },
  { value: '∞', label: 'Curiosity' },
]

const paragraphText =
  "I got into software because I liked making things. Turns out I also like breaking things, which is probably why I ended up in cybersecurity too. These days I split my time between AI projects, full-stack work, and trying to keep up with a world that's moving faster than anyone expected. With every major company racing toward whatever comes next in AI, there's genuinely too much to learn and not enough hours, but that's the part I find exciting. Still figuring out where I fit in all of it."

export default function About() {
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const statsRef = useRef(null)
  const watermarkRef = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const words = textRef.current?.querySelectorAll('.about__word')
        if (words?.length) {
          gsap.fromTo(
            words,
            { opacity: 0.1, y: 8 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.03,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: textRef.current,
                start: 'top 75%',
                end: 'bottom 60%',
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          )
        }

        gsap.fromTo(
          statsRef.current?.querySelectorAll('.about__stat'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )

        gsap.fromTo(
          watermarkRef.current,
          { x: '-40vw', opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }, sectionRef)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  const words = paragraphText.split(' ')

  return (
    <section id="about" className="about" ref={sectionRef} aria-label="About section">
      <div className="about__header">
        <span className="about__tag">01: About</span>
      </div>

      <div className="about__inner">
        <p className="about__text" ref={textRef} aria-label={paragraphText}>
          {words.map((word, i) => (
            <span key={i} className="about__word-wrapper">
              <span className="about__word">{word}</span>
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
          <CoffeeCup />
        </p>

        <div className="about__divider-row">
          <div className="about__divider-line" aria-hidden="true" />
          <Link to="/about" className="about__more-btn">More About Me →</Link>
        </div>

        <div className="about__stats" ref={statsRef}>
          {STATS.map(({ value, label }) => (
            <div key={label} className="about__stat">
              <span className="about__stat-value">{value}</span>
              <span className="about__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <span className="about__watermark" ref={watermarkRef} aria-hidden="true">SINCE 2022</span>
    </section>
  )
}
