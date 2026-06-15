import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RESPONSES, FALLBACK } from '../data/botResponses'
import '../styles/AmanBot.css'

const GREETING = "Hey 👋 I'm Aman. Ask me anything: my background, projects, skills, or how to hire me."

const PILLS = [
  'Who are you?',
  'Favourite project?',
  'Are you hiring?',
  'How to contact?',
]

function getResponse(input) {
  const lower = input.toLowerCase()
  for (const intent of RESPONSES) {
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      return intent.response
    }
  }
  return FALLBACK
}

export default function AmanBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: GREETING }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showPills, setShowPills] = useState(true)
  const threadRef = useRef(null)
  const inputRef = useRef(null)
  const windowRef = useRef(null)
  const fabRef = useRef(null)

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight
    }
  }, [messages, typing])

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current?.focus(), 280)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (
        windowRef.current && !windowRef.current.contains(e.target) &&
        fabRef.current && !fabRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  const send = (text) => {
    const msg = text.trim()
    if (!msg) return
    setShowPills(false)
    setMessages((prev) => [...prev, { from: 'user', text: msg }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { from: 'bot', text: getResponse(msg) }])
    }, 600)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={windowRef}
            className="amanbot__window"
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Chat with Aman"
            aria-modal="true"
          >
            <div className="amanbot__header">
              <span className="amanbot__header-title">Ask Aman</span>
              <button
                className="amanbot__close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            <div className="amanbot__thread" ref={threadRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`amanbot__msg amanbot__msg--${msg.from}`}>
                  {msg.text}
                </div>
              ))}

              {typing && (
                <div className="amanbot__msg amanbot__msg--bot amanbot__typing" aria-label="Aman is typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}

              {showPills && !typing && (
                <div className="amanbot__pills">
                  {PILLS.map((pill) => (
                    <button
                      key={pill}
                      className="amanbot__pill"
                      onClick={() => send(pill)}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form className="amanbot__form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                id="amanbot-input"
                name="amanbot-input"
                className="amanbot__input"
                type="text"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Chat input"
                autoComplete="off"
              />
              <button
                type="submit"
                className="amanbot__send"
                aria-label="Send message"
                disabled={!input.trim()}
              >
                →
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={fabRef}
        className="amanbot__fab"
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.9 }}
        aria-label={open ? 'Close chat' : 'Chat with Aman'}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              className="amanbot__fab-icon"
              initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              💬
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
