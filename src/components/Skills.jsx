import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/skills.css'

const SKILLS_ROW_1 = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'FastAPI',
  'Docker', 'GCP', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL',
]

const SKILLS_ROW_2 = [
  'XGBoost', 'DistilBERT', 'LangChain', 'RAG Pipelines', 'Penetration Testing',
  'JWT · OAuth', 'Vitest · TDD', 'Tailwind CSS', 'GSAP', 'Framer Motion',
  'GitHub Actions', 'Tableau',
]

const CATEGORIES = [
  { label: 'Frontend', items: 'React · Next.js · TypeScript · Tailwind · Framer Motion' },
  { label: 'Backend & AI', items: 'Node.js · Python · FastAPI · LangChain · XGBoost · BERT' },
  { label: 'Infrastructure', items: 'Docker · GCP · GitHub Actions · PostgreSQL · MongoDB' },
  { label: 'Security', items: 'Penetration Testing · JWT · OAuth · Secure API Design' },
]

function Ticker({ items, direction = 1, animRef, viewportRef }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const el = trackRef.current
    if (!el) return

    const totalWidth = el.scrollWidth / 2
    gsap.set(el, { x: direction === 1 ? 0 : -totalWidth })

    const anim = gsap.to(el, {
      x: direction === 1 ? -totalWidth : 0,
      duration: 30,
      ease: 'none',
      repeat: -1,
      paused: true,
    })

    if (animRef) animRef.current = anim

    const parent = el.parentElement
    const pause = () => anim.pause()
    const resume = () => anim.resume()

    parent.addEventListener('mouseenter', pause)
    parent.addEventListener('mouseleave', resume)
    parent.addEventListener('touchstart', pause, { passive: true })
    parent.addEventListener('touchend', resume)

    return () => {
      anim.kill()
      if (animRef) animRef.current = null
      parent.removeEventListener('mouseenter', pause)
      parent.removeEventListener('mouseleave', resume)
      parent.removeEventListener('touchstart', pause)
      parent.removeEventListener('touchend', resume)
    }
  }, [direction])

  const doubled = [...items, ...items]

  return (
    <div className="ticker__viewport" ref={viewportRef} aria-hidden="true">
      <div className="ticker__track" ref={trackRef}>
        {doubled.map((skill, i) => (
          <span key={i} className="ticker__item">
            {skill}
            <span className="ticker__dot">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const sectionRef = useRef(null)
  const ticker1AnimRef = useRef(null)
  const ticker2AnimRef = useRef(null)
  const ticker1ViewportRef = useRef(null)
  const ticker2ViewportRef = useRef(null)
  const catRefs = useRef([])

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tickerTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo(
            ticker1ViewportRef.current,
            { xPercent: 100 },
            {
              xPercent: 0,
              duration: 0.9,
              ease: 'power3.out',
              onComplete: () => ticker1AnimRef.current?.play(),
            }
          )
          gsap.fromTo(
            ticker2ViewportRef.current,
            { xPercent: -100 },
            {
              xPercent: 0,
              duration: 0.9,
              ease: 'power3.out',
              delay: 0.08,
              onComplete: () => ticker2AnimRef.current?.play(),
            }
          )
        },
        onLeave: () => {
          ticker1AnimRef.current?.pause()
          ticker2AnimRef.current?.pause()
        },
        onEnterBack: () => {
          ticker1AnimRef.current?.play()
          ticker2AnimRef.current?.play()
        },
        onLeaveBack: () => {
          ticker1AnimRef.current?.pause()
          ticker2AnimRef.current?.pause()
          gsap.set(ticker1ViewportRef.current, { xPercent: 100 })
          gsap.set(ticker2ViewportRef.current, { xPercent: -100 })
        },
      })

      const ctx = gsap.context(() => {
        catRefs.current.forEach((cat, i) => {
          if (!cat) return
          const title = cat.querySelector('.skills__category-label')
          const items = cat.querySelector('.skills__category-items')

          gsap.fromTo(
            cat,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: 'expo.out',
              delay: i * 0.18,
              scrollTrigger: {
                trigger: cat,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )

          if (title) {
            gsap.fromTo(
              title,
              { x: -15, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 1.1,
                ease: 'expo.out',
                delay: i * 0.18,
                scrollTrigger: {
                  trigger: cat,
                  start: 'top 88%',
                  toggleActions: 'play reverse play reverse',
                },
              }
            )
          }

          if (items) {
            gsap.fromTo(
              items,
              { opacity: 0, y: 10 },
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'expo.out',
                delay: i * 0.18 + 0.15,
                scrollTrigger: {
                  trigger: cat,
                  start: 'top 88%',
                  toggleActions: 'play reverse play reverse',
                },
              }
            )
          }
        })
      }, sectionRef)

      return () => {
        tickerTrigger.kill()
        ctx.revert()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="skills" className="skills" ref={sectionRef} aria-label="Skills section">
      <div className="skills__header">
        <span className="skills__tag">03: Expertise</span>
      </div>

      <div className="skills__tickers">
        <Ticker items={SKILLS_ROW_1} direction={1} animRef={ticker1AnimRef} viewportRef={ticker1ViewportRef} />
        <Ticker items={SKILLS_ROW_2} direction={-1} animRef={ticker2AnimRef} viewportRef={ticker2ViewportRef} />
      </div>

      <div className="skills__categories" aria-label="Skill categories">
        {CATEGORIES.map(({ label, items }, i) => (
          <div
            key={label}
            className="skills__category"
            ref={el => { catRefs.current[i] = el }}
          >
            <span className="skills__category-label">{label}</span>
            <span className="skills__category-items">{items}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
