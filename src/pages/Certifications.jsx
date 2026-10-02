import { forwardRef, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cloud, Bot, Zap, Cog, Award, Shield, Code2, Database, Server, Filter, ExternalLink, X, ArrowRight,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { CardSkeletonGrid, EmptyState, ErrorState } from '../components/DataState'
import { useCertifications } from '../hooks/useApi'
import { usePageMeta } from '../hooks/usePageMeta'
import { useBodyScrollLock, useDialog } from '../hooks/useDialog'
import {
  asArray, formatMonthYear, formatYear, humanize, safeUrl,
} from '../lib/content'

const CATEGORY_META = {
  cloud: { label: 'Cloud', icon: Cloud, color: '#FF9900' },
  'ai-ml': { label: 'AI/ML', icon: Bot, color: '#00A3E0' },
  development: { label: 'Development', icon: Code2, color: '#3B82F6' },
  security: { label: 'Security', icon: Shield, color: '#EF4444' },
  data: { label: 'Data', icon: Database, color: '#10B981' },
  devops: { label: 'DevOps', icon: Server, color: '#A78BFA' },
  other: { label: 'Engineering', icon: Cog, color: '#9CA3AF' },
}

const categoryMeta = (key) => CATEGORY_META[key] || { label: humanize(key) || 'Other', icon: Award, color: '#9CA3AF' }

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
}

/** Badge image when the CMS provides one, otherwise the category icon. */
const CertVisual = ({ cert, size = 'md' }) => {
  const meta = categoryMeta(cert.category)
  const image = safeUrl(cert.badgeUrl) || safeUrl(cert.issuerLogo)
  const box = size === 'lg' ? 'h-20 w-20 rounded-2xl' : 'h-14 w-14 rounded-xl'
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden ${box}`}
      style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
      aria-hidden="true"
    >
      {image ? (
        <img src={image} alt="" width="80" height="80" loading="lazy" decoding="async" className="h-full w-full object-contain p-1.5" />
      ) : (
        <meta.icon size={size === 'lg' ? 40 : 28} />
      )}
    </div>
  )
}

const StatusBadge = ({ cert }) => (cert.isValid === false ? (
  <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-200">
    Expired
  </span>
) : null)

// Detail dialog
const CertificationModal = ({ cert, onClose }) => {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  useBodyScrollLock(true)
  useDialog(dialogRef, true, { onEscape: onClose, initialFocusRef: closeRef })

  const meta = categoryMeta(cert.category)
  const skills = asArray(cert.skills)
  const verifyUrl = safeUrl(cert.credentialUrl)
  const issued = formatMonthYear(cert.issueDate)
  const expires = cert.doesNotExpire ? 'No expiration' : formatMonthYear(cert.expirationDate)

  const facts = [
    issued && { label: 'Issued', value: issued },
    expires && { label: cert.isValid === false ? 'Expired' : 'Expires', value: expires },
    cert.credentialId && { label: 'Credential ID', value: cert.credentialId },
    cert.level && { label: 'Level', value: humanize(cert.level) },
  ].filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-dark/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-dialog-title"
        aria-describedby={cert.description ? 'cert-dialog-desc' : undefined}
        tabIndex={-1}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card max-h-[90vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-b-none bg-dark-light/95 p-6
                   sm:rounded-b-xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <CertVisual cert={cert} size="lg" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <h2 id="cert-dialog-title" className="mb-1 font-heading text-2xl font-bold text-white">{cert.name}</h2>
        <p className="mb-4 font-medium text-primary">{cert.issuer}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
            {meta.label}
          </span>
          <StatusBadge cert={cert} />
        </div>

        {cert.description && <p id="cert-dialog-desc" className="mb-6 text-gray-300">{cert.description}</p>}

        {facts.length > 0 && (
          <dl className="mb-6 grid grid-cols-2 gap-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <dt className="text-xs text-gray-400">{fact.label}</dt>
                <dd className="break-words text-sm font-medium text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-300">Skills Validated</h3>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li key={skill} className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-gray-200">{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {verifyUrl && (
          <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
            <span className="flex items-center justify-center">
              Verify Credential
              <ExternalLink size={16} className="ml-2" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        )}
      </motion.div>
    </motion.div>
  )
}

const CertificationCard = forwardRef(({ cert, onOpen }, ref) => {
  const meta = categoryMeta(cert.category)
  const skills = asArray(cert.skills)
  const year = formatYear(cert.issueDate)

  return (
    <motion.li
      ref={ref}
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="glass-card group relative flex flex-col p-6 transition-colors duration-300 hover:border-primary/50"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <CertVisual cert={cert} />
        <div className="flex flex-wrap justify-end gap-2">
          <StatusBadge cert={cert} />
          {year && (
            <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
              {year}
            </span>
          )}
        </div>
      </div>

      <h3 className="mb-1 font-heading text-lg font-bold text-white transition-colors group-hover:text-primary">{cert.name}</h3>
      {cert.issuer && <p className="mb-4 text-sm text-gray-300">{cert.issuer}</p>}

      {skills.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2" aria-label="Skills">
          {skills.slice(0, 3).map((skill) => (
            <li key={skill} className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-200">{skill}</li>
          ))}
          {skills.length > 3 && (
            <li className="rounded-md bg-primary/15 px-2 py-1 text-xs text-primary">
              +{skills.length - 3}
              <span className="sr-only"> more</span>
            </li>
          )}
        </ul>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="min-w-0 truncate text-xs text-gray-400">
          {cert.credentialId ? `ID: ${cert.credentialId}` : meta.label}
        </span>
        {/* Stretched button: the whole card opens the details */}
        <button
          type="button"
          onClick={(e) => onOpen(cert, e.currentTarget)}
          aria-haspopup="dialog"
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded text-sm font-medium text-primary
                     after:absolute after:inset-0 after:rounded-xl after:content-['']"
        >
          View details
          <span className="sr-only">: {cert.name}</span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    </motion.li>
  )
})
CertificationCard.displayName = 'CertificationCard'

const Certifications = () => {
  usePageMeta({
    title: 'Certifications',
    description: 'Certifications of Parfait Tedom Tedom in cloud computing, artificial intelligence and engineering.',
  })
  const [selectedCert, setSelectedCert] = useState(null)
  const [filter, setFilter] = useState('all')
  const { certifications, loading, error, retry } = useCertifications()

  const filters = useMemo(() => {
    const present = [...new Set(certifications.map((c) => c.category || 'other'))]
    const ordered = [
      ...Object.keys(CATEGORY_META).filter((k) => present.includes(k)),
      ...present.filter((k) => !CATEGORY_META[k]),
    ]
    return [
      { id: 'all', label: 'All', icon: Filter },
      ...ordered.map((id) => ({ id, label: categoryMeta(id).label, icon: categoryMeta(id).icon })),
    ]
  }, [certifications])

  const filteredCerts = filter === 'all'
    ? certifications
    : certifications.filter((c) => (c.category || 'other') === filter)

  const stats = useMemo(() => {
    const years = certifications.map((c) => Number(formatYear(c.issueDate))).filter(Boolean)
    return [
      { value: certifications.length, label: 'Certifications', icon: Award },
      { value: certifications.filter((c) => c.category === 'ai-ml').length, label: 'AI/ML Certs', icon: Bot },
      { value: certifications.filter((c) => c.category === 'cloud').length, label: 'Cloud Certs', icon: Cloud },
      years.length > 0 && { value: Math.max(...years), label: 'Latest Year', icon: Zap },
    ].filter(Boolean)
  }, [certifications])

  let content
  if (loading) {
    content = <CardSkeletonGrid count={6} label="Loading certifications…" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" cardClassName="h-72" />
  } else if (error) {
    content = <ErrorState title="Certifications could not be loaded" message={error} onRetry={retry} />
  } else if (certifications.length === 0) {
    content = (
      <EmptyState icon={Award} title="Certifications Coming Soon">
        Certifications information is not yet available or the section is currently under maintenance.
        Please check back later!
      </EmptyState>
    )
  } else {
    content = (
      <>
        {/* Stats */}
        <dl className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card flex flex-col-reverse items-center p-4 text-center">
              <dt className="text-sm text-gray-300">{stat.label}</dt>
              <dd className="flex flex-col items-center">
                <stat.icon className="mb-2 text-primary" size={26} aria-hidden="true" />
                <span className="font-display text-2xl font-bold text-gradient md:text-3xl">{stat.value}</span>
              </dd>
            </div>
          ))}
        </dl>

        {filters.length > 2 && (
          <div role="group" aria-label="Filter certifications by category" className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
            {filters.map((cat) => {
              const active = filter === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilter(cat.id)}
                  aria-pressed={active}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? 'bg-primary text-dark shadow-lg shadow-primary/30'
                      : 'border border-white/10 bg-dark-light/60 text-gray-200 hover:border-primary/50 hover:text-white'
                  }`}
                >
                  <cat.icon size={16} aria-hidden="true" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        )}

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert) => (
              <CertificationCard key={cert.id || cert.name} cert={cert} onOpen={setSelectedCert} />
            ))}
          </AnimatePresence>
        </ul>
      </>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHero
        tag="Certifications & Credentials"
        title="Professional"
        highlight="Certifications"
        subtitle="Validated expertise through industry-recognized certifications in cloud computing, artificial intelligence, and engineering."
      />

      <section className="pb-8" aria-labelledby="cert-list-title">
        <div className="container-custom">
          <h2 id="cert-list-title" className="sr-only">Certification list</h2>
          {content}
        </div>
      </section>

      {/* Portalled to <body> so the dialog stacks above the header and chat launcher */}
      {createPortal(
        <AnimatePresence>
          {selectedCert && <CertificationModal cert={selectedCert} onClose={() => setSelectedCert(null)} />}
        </AnimatePresence>,
        document.body,
      )}

      {/* CTA Section */}
      <section className="container-custom mt-16 sm:mt-20" aria-labelledby="cert-cta-title">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card mx-auto max-w-3xl p-8 text-center md:p-12"
        >
          <h2 id="cert-cta-title" className="mb-4 font-display text-2xl font-bold text-white md:text-3xl">
            Continuous Learning Journey
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-gray-300">
            I&apos;m committed to staying at the forefront of technology.
            Currently pursuing AWS, Nvidia, and more AI certifications.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/contact" className="btn-primary">
              <span>Let&apos;s Connect</span>
            </Link>
            <Link to="/projects" className="btn-outline">
              View My Work
            </Link>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}

export default Certifications
