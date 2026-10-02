import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal, ChevronRight } from 'lucide-react'
import { useBodyScrollLock, useDialog } from '../hooks/useDialog'
import { SHORT_NAME } from '../data/profile'

export const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/skills', label: 'Skills' },
  { path: '/projects', label: 'Projects' },
  { path: '/experience', label: 'Experience' },
  { path: '/certifications', label: 'Certifications' },
  { path: '/contact', label: 'Contact' },
]

const Logo = () => (
  <Link
    to="/"
    className="group flex min-h-[44px] items-center gap-3 rounded-lg"
    aria-label={`${SHORT_NAME}, home`}
  >
    <motion.span
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                 bg-gradient-to-br from-primary to-secondary shadow-glow"
      aria-hidden="true"
    >
      <Terminal className="text-dark" size={20} />
    </motion.span>
    <span className="flex flex-col" aria-hidden="true">
      <span className="font-display text-base font-bold leading-tight text-white sm:text-lg">
        {SHORT_NAME}
      </span>
      <span className="font-mono text-xs text-primary">&lt;FullStackEngineer /&gt;</span>
    </span>
  </Link>
)

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const panelRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu on navigation…
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // …and when the viewport grows to the desktop layout (menu is hidden there).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setIsOpen(false)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  useBodyScrollLock(isOpen)
  useDialog(panelRef, isOpen, { onEscape: () => setIsOpen(false) })

  const isActive = (path) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path))

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || isOpen
            ? 'border-b border-primary/10 bg-dark/90 shadow-lg backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav aria-label="Main" className="container-custom">
          <div className="flex h-20 items-center justify-between gap-4">
            <Logo />

            {/* Desktop Navigation */}
            <ul className="hidden items-center lg:flex">
              {navLinks.map((link) => {
                const active = isActive(link.path)
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      aria-current={active ? 'page' : undefined}
                      className="group relative flex min-h-[44px] items-center px-3 xl:px-4"
                    >
                      <span
                        className={`font-heading text-sm transition-colors duration-300 ${
                          active ? 'text-primary' : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {link.label}
                      </span>

                      {active && (
                        <motion.span
                          layoutId="activeNav"
                          className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary shadow-glow"
                          aria-hidden="true"
                        />
                      )}
                      <span
                        className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent
                                   via-primary to-transparent transition-all duration-300 group-hover:w-full"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* CTA Button - Desktop */}
            <Link to="/contact" className="btn-primary hidden px-6 text-sm lg:inline-flex">
              <span>Let&apos;s Talk</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/30
                         text-primary transition-colors hover:bg-primary/10 lg:hidden"
            >
              {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu — portalled to <body> so it stacks above the chat launcher */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[70] bg-dark/80 backdrop-blur-sm lg:hidden"
                aria-hidden="true"
              />

              <motion.div
                key="panel"
                ref={panelRef}
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                tabIndex={-1}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 260 }}
                className="fixed bottom-0 right-0 top-0 z-[80] flex w-80 max-w-[85vw] flex-col overflow-y-auto
                           overscroll-contain border-l border-primary/20 bg-dark-light lg:hidden"
              >
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="font-display font-bold text-white">Menu</span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close menu"
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300
                                 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <X size={20} aria-hidden="true" />
                    </button>
                  </div>

                  <nav aria-label="Mobile">
                    <ul className="space-y-1">
                      {navLinks.map((link, index) => {
                        const active = isActive(link.path)
                        return (
                          <motion.li
                            key={link.path}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <Link
                              to={link.path}
                              aria-current={active ? 'page' : undefined}
                              onClick={() => setIsOpen(false)}
                              className={`group flex min-h-[48px] items-center justify-between rounded-lg px-4 py-3
                                          transition-colors duration-300 ${
                                active
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-gray-200 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span className="font-heading">{link.label}</span>
                              <ChevronRight
                                size={16}
                                aria-hidden="true"
                                className={`transition-transform duration-300 ${
                                  active ? 'text-primary' : 'text-gray-400 group-hover:translate-x-1'
                                }`}
                              />
                            </Link>
                          </motion.li>
                        )
                      })}
                    </ul>
                  </nav>

                  <div className="mt-8 border-t border-white/10 pt-8">
                    <Link to="/contact" className="btn-primary w-full" onClick={() => setIsOpen(false)}>
                      <span>Let&apos;s Talk</span>
                    </Link>
                  </div>

                  <p className="mt-auto pt-8 text-center font-mono text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} {SHORT_NAME}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

export default Navbar
