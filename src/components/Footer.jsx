import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Terminal, ArrowUpRight } from 'lucide-react'
import {
  FULL_NAME, SHORT_NAME, EMAIL, LOCATION, COMPANY_URL, COMPANY_NAME, SOCIAL_LINKS,
} from '../data/profile'

const quickLinks = [
  { label: 'About', path: '/about' },
  { label: 'Skills', path: '/skills' },
  { label: 'Projects', path: '/projects' },
  { label: 'Experience', path: '/experience' },
  { label: 'Certifications', path: '/certifications' },
  { label: 'Contact', path: '/contact' },
]

const expertise = [
  'AI & Machine Learning',
  'Full-Stack Development',
  'IoT & Embedded Systems',
  'Robotics & Mechatronics',
  'Cloud Architecture',
  'CAD Design',
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/5">
      {/* Gradient line */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden="true" />

      <div className="container-custom py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="group mb-6 inline-flex items-center gap-3 rounded-lg" aria-label={`${SHORT_NAME}, home`}>
              <motion.span
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-glow"
                aria-hidden="true"
              >
                <Terminal className="text-dark" size={20} />
              </motion.span>
              <span className="flex flex-col" aria-hidden="true">
                <span className="font-display text-lg font-bold leading-tight text-white">{FULL_NAME}</span>
                <span className="font-mono text-xs text-primary">Full Stack Engineer</span>
              </span>
            </Link>

            <p className="mb-6 max-w-xs text-sm leading-relaxed text-gray-300">
              Crafting intelligent solutions at the intersection of software,
              hardware, and artificial intelligence. From Edmonton{' '}
              <span role="img" aria-label="Canada">🇨🇦</span>
            </p>

            <p className="flex items-center text-sm text-gray-400">
              <MapPin size={14} className="mr-2 shrink-0 text-primary" aria-hidden="true" />
              <span>{LOCATION}</span>
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links" className="mb-4 font-heading text-base font-semibold text-white">Quick Links</h2>
            <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-1">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group inline-flex min-h-[44px] items-center text-sm text-gray-300 transition-colors duration-300 hover:text-primary"
                  >
                    <span className="mr-0 h-px w-0 bg-primary transition-all duration-300 group-hover:mr-2 group-hover:w-2" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Expertise */}
          <div>
            <h2 className="mb-4 font-heading text-base font-semibold text-white">Expertise</h2>
            <ul className="space-y-3">
              {expertise.map((item) => (
                <li key={item} className="flex items-center text-sm text-gray-300">
                  <span className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h2 className="mb-4 font-heading text-base font-semibold text-white">Connect</h2>

            <ul className="mb-6 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const external = social.href.startsWith('http')
                return (
                  <li key={social.label}>
                    <motion.a
                      href={social.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noopener noreferrer' : undefined}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-gray-300
                                 transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                      aria-label={external ? `${social.label} (opens in a new tab)` : social.label}
                    >
                      <social.icon size={18} aria-hidden="true" />
                    </motion.a>
                  </li>
                )
              })}
            </ul>

            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex min-h-[44px] max-w-full items-center break-all text-sm text-primary transition-colors duration-300 hover:text-primary-light"
            >
              <span>{EMAIL}</span>
              <ArrowUpRight
                size={14}
                aria-hidden="true"
                className="ml-1 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar (extra bottom padding on mobile keeps it clear of the chat button) */}
      <div className="border-t border-white/5">
        <div className="container-custom pb-24 pt-6 sm:pb-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} {SHORT_NAME}. All rights reserved.
            </p>
            <div className="flex flex-col items-center md:flex-row md:gap-6">
              <Link
                to="/privacy"
                className="inline-flex min-h-[44px] items-center text-sm text-gray-400 transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>
              <a
                href={COMPANY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center text-sm text-gray-400 transition-colors hover:text-primary"
              >
                {SHORT_NAME} at {COMPANY_NAME}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-primary/5 blur-[80px]" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-secondary/5 blur-[80px]" aria-hidden="true" />
    </footer>
  )
}

export default Footer
