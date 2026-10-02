import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home as HomeIcon, ArrowLeft, Compass } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'

const suggestions = [
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills' },
  { path: '/experience', label: 'Experience' },
  { path: '/contact', label: 'Contact' },
]

/** Shown for unknown routes (CloudFront serves index.html for every path). */
const NotFound = ({
  title = 'Page not found',
  message = "The page you're looking for doesn't exist or has been moved.",
}) => {
  const { pathname } = useLocation()
  usePageMeta({ title, noindex: true })

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-[80vh] items-center overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div className="container-custom relative z-10 text-center">
        <p className="mb-4 font-mono text-sm text-primary">
          <span aria-hidden="true">printf(&quot;</span>404<span aria-hidden="true">&quot;);</span>
        </p>
        <h1 className="mb-4 text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          {title.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-gradient">{title.split(' ').slice(-1)}</span>
        </h1>
        <p className="mx-auto mb-2 max-w-xl text-lg text-gray-300">{message}</p>
        <p className="mx-auto mb-10 max-w-xl break-all font-mono text-sm text-gray-400">{pathname}</p>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            <span className="flex items-center">
              <HomeIcon size={18} className="mr-2" aria-hidden="true" />
              Back to home
            </span>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-outline w-full sm:w-auto"
          >
            <ArrowLeft size={18} className="mr-2" aria-hidden="true" />
            Go back
          </button>
        </div>

        <nav aria-label="Suggested pages">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Compass size={16} aria-hidden="true" />
            Or explore:
          </p>
          <ul className="flex flex-wrap justify-center gap-2">
            {suggestions.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-white/10 bg-dark-light/50 px-4 text-sm
                             text-gray-200 transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.section>
  )
}

export default NotFound
