import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react'
import { apiRequest } from '../lib/api'
import { useBodyScrollLock, useDialog } from '../hooks/useDialog'

const MAX_LENGTH = 1000
const HISTORY_TURNS = 8
const HISTORY_ITEM_MAX = 2000

const SUGGESTED_QUESTIONS = [
  "What are Parfait's main skills?",
  'Tell me about his AI/ML projects',
  'What certifications does he have?',
]

const GREETING = {
  id: 'greeting',
  role: 'assistant',
  local: true,
  content: "Hi! I'm Helena, Parfait's AI assistant. I can tell you all about his skills, projects, experience, and more. What would you like to know?",
}

let messageId = 0
const nextId = () => {
  messageId += 1
  return `m${messageId}`
}

// ---------------------------------------------------------------- Safe rendering
// Supports **bold**, line breaks (via white-space: pre-wrap) and bare http(s)
// links. Everything is rendered as React text nodes: no HTML injection possible.
const URL_PATTERN = /(https?:\/\/[^\s<>"'`]+[^\s<>"'`.,;:!?)\]])/g

const linkify = (text, keyPrefix) => text.split(URL_PATTERN).map((part, i) => {
  if (i % 2 === 1) {
    return (
      <a
        key={`${keyPrefix}-l${i}`}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-primary underline underline-offset-2 hover:text-primary-light"
      >
        {part}
      </a>
    )
  }
  return part ? <Fragment key={`${keyPrefix}-t${i}`}>{part}</Fragment> : null
})

const renderRichText = (text) => String(text ?? '')
  .split(/\*\*([\s\S]+?)\*\*/g)
  .map((part, i) => (i % 2 === 1
    ? <strong key={`b${i}`} className="font-semibold text-white">{linkify(part, `b${i}`)}</strong>
    : <Fragment key={`p${i}`}>{linkify(part, `p${i}`)}</Fragment>))

const errorMessageFor = (err) => {
  if (err?.status === 0 || !err?.status) {
    return err?.message?.includes('too long')
      ? "I'm taking too long to answer right now. Please try again in a moment."
      : "I'm having trouble connecting right now. Please check your connection and try again, or reach Parfait through the contact page."
  }
  return err.message
}

// ---------------------------------------------------------------- Component
function Helena() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  const dialogRef = useRef(null)
  const logRef = useRef(null)
  const inputRef = useRef(null)
  const titleRef = useRef(null)
  const launcherRef = useRef(null)
  const messagesRef = useRef(messages)
  const returnFocusRef = useRef(false)
  messagesRef.current = messages

  const open = () => {
    setIsCompact(window.matchMedia('(max-width: 639px)').matches)
    setIsOpen(true)
  }

  const close = useCallback(() => {
    returnFocusRef.current = true
    setIsOpen(false)
  }, [])

  // On touch devices, don't pop the keyboard over the conversation on open.
  const prefersInputFocus = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

  useBodyScrollLock(isOpen && isCompact)
  useDialog(dialogRef, isOpen, {
    onEscape: close,
    initialFocusRef: prefersInputFocus ? inputRef : titleRef,
    trap: isCompact,
  })

  // The launcher is re-mounted on close: give it focus back.
  useEffect(() => {
    if (!isOpen && returnFocusRef.current) {
      returnFocusRef.current = false
      launcherRef.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  // Keep the newest message in view (scrolls the log only, never the page).
  useEffect(() => {
    const log = logRef.current
    if (!log) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    log.scrollTo({ top: log.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [messages, isLoading, isOpen])

  const send = useCallback(async (rawText) => {
    const text = String(rawText ?? '').trim().slice(0, MAX_LENGTH)
    if (!text || isLoading) return

    // Last turns of the conversation, excluding the local greeting and failed exchanges.
    const history = messagesRef.current
      .filter((m) => !m.local && !m.error && !m.failed)
      .slice(-HISTORY_TURNS)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, HISTORY_ITEM_MAX) }))

    const userMessage = { id: nextId(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await apiRequest('/helena/chat', {
        method: 'POST',
        body: { message: text, history },
        timeout: 30000,
      })
      const reply = typeof res.response === 'string' && res.response.trim()
        ? res.response.trim()
        : "Sorry, I couldn't come up with an answer. Could you rephrase your question?"
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: reply }])
    } catch (err) {
      const canRetry = err?.status !== 400 && err?.status !== 429
      setMessages((prev) => [
        ...prev.map((m) => (m.id === userMessage.id ? { ...m, failed: true } : m)),
        {
          id: nextId(),
          role: 'assistant',
          error: true,
          content: errorMessageFor(err),
          retryText: canRetry ? text : null,
          retryFor: userMessage.id,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const retry = (message) => {
    setMessages((prev) => prev.filter((m) => m.id !== message.id && m.id !== message.retryFor))
    send(message.retryText)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const showSuggestions = messages.length === 1 && !isLoading
  const remaining = MAX_LENGTH - input.length

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="helena-launcher"
            ref={launcherRef}
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={open}
            aria-label="Chat with Helena, Parfait's AI assistant"
            aria-haspopup="dialog"
            aria-expanded={false}
            aria-controls="helena-chat"
            className="fixed bottom-4 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full
                       bg-gradient-to-r from-primary to-secondary shadow-glow transition-shadow duration-300
                       hover:shadow-glow-lg sm:bottom-6 sm:right-6"
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          >
            <Bot className="text-white" size={24} aria-hidden="true" />
            <span className="helena-ping pointer-events-none absolute inset-0 rounded-full bg-primary/40" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="helena-chat"
            ref={dialogRef}
            id="helena-chat"
            role="dialog"
            aria-modal={isCompact}
            aria-labelledby="helena-title"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[65] flex flex-col overflow-hidden border-white/10 bg-dark-lighter shadow-2xl
                       sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(580px,calc(100dvh-3rem))] sm:w-[400px]
                       sm:rounded-2xl sm:border"
          >
            {/* Header */}
            <div
              className="flex flex-shrink-0 items-center justify-between border-b border-white/10
                         bg-gradient-to-r from-primary/20 to-secondary/20 px-4 py-3"
              style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary" aria-hidden="true">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h2 id="helena-title" ref={titleRef} tabIndex={-1} className="font-semibold text-white">
                    Helena
                  </h2>
                  <p className="flex items-center gap-1.5 text-xs text-gray-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                    AI Assistant • Online
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Conversation with Helena"
              className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4"
            >
              {messages.map((message) => {
                const isUser = message.role === 'user'
                return (
                  <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[88%] items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                          isUser ? 'bg-primary/20' : 'bg-gradient-to-r from-primary to-secondary'
                        }`}
                        aria-hidden="true"
                      >
                        {isUser ? <User className="text-primary" size={16} /> : <Bot className="text-white" size={16} />}
                      </div>
                      <div
                        className={`min-w-0 rounded-2xl px-4 py-2.5 ${
                          isUser
                            ? 'rounded-tr-sm bg-primary text-dark'
                            : message.error
                              ? 'rounded-tl-sm border border-red-400/30 bg-red-500/10 text-red-100'
                              : 'rounded-tl-sm border border-white/10 bg-dark text-gray-200'
                        }`}
                      >
                        <span className="sr-only">{isUser ? 'You: ' : 'Helena: '}</span>
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {isUser ? message.content : renderRichText(message.content)}
                        </p>
                        {message.error && message.retryText && (
                          <button
                            type="button"
                            onClick={() => retry(message)}
                            disabled={isLoading}
                            className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-red-300/30 px-3
                                       text-xs font-medium text-red-100 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                          >
                            <RefreshCw size={14} aria-hidden="true" />
                            Try again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary" aria-hidden="true">
                    <Bot className="text-white" size={16} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-dark px-4 py-3.5">
                    <span className="sr-only">Helena is typing…</span>
                    <span className="flex gap-1" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-2 w-2 animate-bounce rounded-full bg-primary/80"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested questions */}
            {showSuggestions && (
              <div className="flex-shrink-0 px-4 pb-2">
                <p className="mb-2 text-xs text-gray-400" id="helena-suggestions">Suggested questions:</p>
                <ul className="flex flex-wrap gap-2" aria-labelledby="helena-suggestions">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <li key={question}>
                      <button
                        type="button"
                        onClick={() => send(question)}
                        className="min-h-[44px] rounded-full bg-white/5 px-3 py-2 text-left text-xs text-gray-300
                                   transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex-shrink-0 border-t border-white/10 p-3 sm:p-4"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
            >
              <div className="flex items-center gap-2">
                <label htmlFor="helena-input" className="sr-only">Ask Helena a question</label>
                <input
                  ref={inputRef}
                  id="helena-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={MAX_LENGTH}
                  autoComplete="off"
                  enterKeyHint="send"
                  aria-describedby={remaining < 150 ? 'helena-count' : undefined}
                  placeholder="Ask me anything about Parfait..."
                  className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-white/10 bg-dark px-4 py-2.5 text-base text-white
                             placeholder-gray-400 transition-colors focus:border-primary/60 sm:text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary
                             transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="text-white" size={18} aria-hidden="true" />
                </button>
              </div>
              {remaining < 150 && (
                <p id="helena-count" className="mt-1.5 text-right text-xs text-gray-400">
                  {remaining} characters left
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Helena
