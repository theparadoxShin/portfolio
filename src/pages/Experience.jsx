import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Briefcase, Calendar, MapPin, ExternalLink, ChevronRight, Building2, Clock,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { CardSkeletonGrid, EmptyState, ErrorState } from '../components/DataState'
import { useExperiences } from '../hooks/useApi'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  asArray, durationBetween, formatDateRange, humanize, safeUrl,
} from '../lib/content'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const DEFAULT_COLOR = '#00D9FF'
const isHexColor = (c) => typeof c === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)

const formatLocation = (location) => {
  if (!location) return null
  const place = [location.city, location.country].filter(Boolean).join(', ')
  if (location.remote) return place ? `${place} (Remote)` : 'Remote'
  return place || null
}

// Experience Card
const ExperienceCard = ({ experience, index }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const color = isHexColor(experience.color) ? experience.color : DEFAULT_COLOR
  const companyUrl = safeUrl(experience.companyUrl)
  const logo = safeUrl(experience.companyLogo)
  const location = formatLocation(experience.location)
  const dates = formatDateRange(experience.startDate, experience.endDate, experience.isCurrent)
  const duration = experience.duration
    || durationBetween(experience.startDate, experience.isCurrent ? null : experience.endDate)
  const achievements = asArray(experience.achievements)
    .map((a) => (typeof a === 'string' ? { title: a } : a))
    .filter((a) => a?.title || a?.description)
  const responsibilities = asArray(experience.responsibilities).filter(Boolean)
  const technologies = asArray(experience.technologies)

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index, 3) * 0.08 }}
      className="relative"
    >
      {/* Timeline dot (desktop) */}
      <span
        className="absolute -left-2 top-8 hidden h-4 w-4 rounded-full ring-4 ring-dark lg:block"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      <article className="card lg:ml-10">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10"
              style={{ backgroundColor: `${color}20` }}
              aria-hidden="true"
            >
              {logo ? (
                <img src={logo} alt="" width="56" height="56" loading="lazy" decoding="async" className="h-full w-full object-contain p-1" />
              ) : (
                <Building2 size={24} style={{ color }} />
              )}
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {experience.isCurrent && (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-300">Current</span>
                )}
                {experience.type && <span className="text-sm text-gray-400">{humanize(experience.type)}</span>}
              </div>
              <h3 className="mb-1 text-balance font-heading text-xl font-bold text-white sm:text-2xl">{experience.position}</h3>
              {experience.company && (
                <p className="font-medium">
                  {companyUrl ? (
                    <a
                      href={companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <Building2 size={16} aria-hidden="true" />
                      {experience.company}
                      <ExternalLink size={12} className="opacity-70" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-primary">
                      <Building2 size={16} aria-hidden="true" />
                      {experience.company}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          <dl className="flex shrink-0 flex-col gap-1 text-sm sm:items-end sm:text-right">
            {dates && (
              <div className="text-gray-300">
                <dt className="sr-only">Dates</dt>
                <dd className="flex items-center gap-2">
                  <Calendar size={14} className="shrink-0" aria-hidden="true" />
                  {dates}
                </dd>
              </div>
            )}
            {location && (
              <div className="text-gray-400">
                <dt className="sr-only">Location</dt>
                <dd className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0" aria-hidden="true" />
                  {location}
                </dd>
              </div>
            )}
            {duration && (
              <div className="font-mono text-primary">
                <dt className="sr-only">Duration</dt>
                <dd className="flex items-center gap-2">
                  <Clock size={14} className="shrink-0" aria-hidden="true" />
                  {duration}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {experience.description && (
          <p className="mb-6 max-w-prose text-gray-300">{experience.description}</p>
        )}

        {(achievements.length > 0 || responsibilities.length > 0) && (
          <div className="mb-6">
            <h4 className="mb-3 flex items-center font-medium text-white">
              <ChevronRight className="mr-1 text-primary" size={16} aria-hidden="true" />
              {achievements.length > 0 ? 'Key Achievements' : 'Responsibilities'}
            </h4>
            <ul className="space-y-2">
              {(achievements.length > 0 ? achievements : responsibilities.map((r) => ({ title: r }))).map((item, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-300">
                  <span className="mr-3 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                  <span>
                    {item.title}
                    {item.metric && <span className="ml-1 font-medium text-primary">({item.metric})</span>}
                    {item.description && <span className="block text-gray-400">{item.description}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {technologies.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Technologies">
            {technologies.map((tech) => (
              <li key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
                {tech}
              </li>
            ))}
          </ul>
        )}
      </article>
    </motion.li>
  )
}

// Timeline Section
const TimelineSection = ({ experiences, loading, error, retry }) => {
  if (loading) {
    return (
      <section className="py-12 sm:py-20" aria-label="Work experience">
        <div className="container-custom mx-auto max-w-4xl">
          <CardSkeletonGrid count={2} label="Loading experience…" className="space-y-8" cardClassName="h-72" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 sm:py-20" aria-label="Work experience">
        <div className="container-custom">
          <ErrorState title="Experience could not be loaded" message={error} onRetry={retry} />
        </div>
      </section>
    )
  }

  if (experiences.length === 0) {
    return (
      <section className="py-12 sm:py-20" aria-label="Work experience">
        <div className="container-custom">
          <EmptyState icon={Briefcase} title="Experience Coming Soon">
            Work experience is not yet available or the section is currently under maintenance.
            Please check back later!
          </EmptyState>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-20" aria-labelledby="timeline-title">
      <div className="container-custom">
        <h2 id="timeline-title" className="sr-only">Work experience timeline</h2>
        <div className="relative mx-auto max-w-4xl">
          <div
            className="absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-primary via-secondary to-accent lg:block"
            aria-hidden="true"
          />
          <ol className="space-y-8 sm:space-y-12">
            {experiences.map((experience, index) => (
              <ExperienceCard key={experience.id || `${experience.company}-${index}`} experience={experience} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/** Total time worked, without double-counting overlapping roles. */
const yearsOfExperience = (experiences) => {
  const ranges = experiences
    .map((e) => {
      const start = Date.parse(e.startDate)
      const end = e.isCurrent || !e.endDate ? Date.now() : Date.parse(e.endDate)
      return Number.isNaN(start) || Number.isNaN(end) || end < start ? null : [start, end]
    })
    .filter(Boolean)
    .sort((a, b) => a[0] - b[0])

  let total = 0
  let current = null
  ranges.forEach(([s, e]) => {
    if (!current || s > current[1]) {
      if (current) total += current[1] - current[0]
      current = [s, e]
    } else {
      current[1] = Math.max(current[1], e)
    }
  })
  if (current) total += current[1] - current[0]
  return Math.floor(total / (1000 * 60 * 60 * 24 * 365.25))
}

// Summary Stats
const SummarySection = ({ experiences }) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  if (experiences.length === 0) return null

  const years = yearsOfExperience(experiences)
  const companies = new Set(experiences.map((e) => e.company).filter(Boolean)).size

  const stats = [
    years > 0 && { value: `${years}+`, label: 'Years Experience' },
    { value: `${companies || experiences.length}`, label: companies === 1 ? 'Company' : 'Companies' },
    { value: '15+', label: 'Projects Delivered' },
    { value: '3', label: 'Countries' },
  ].filter(Boolean)

  return (
    <section ref={ref} className="relative py-16 sm:py-20" aria-label="Experience summary">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent" aria-hidden="true" />

      <div className="container-custom relative">
        <motion.dl
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.label} variants={fadeInUp} className="flex flex-col-reverse text-center">
              <dt className="text-sm text-gray-300">{stat.label}</dt>
              <motion.dd
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="mb-2 font-display text-4xl font-bold text-gradient md:text-5xl"
              >
                {stat.value}
              </motion.dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}

// Main Experience Component
const Experience = () => {
  usePageMeta({
    title: 'Experience',
    description: 'Professional experience of Parfait Tedom Tedom: full-stack development, AI, IoT and engineering roles.',
  })
  const { experiences, loading, error, retry } = useExperiences()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHero
        tag="Career Journey"
        title="Professional"
        highlight="Experience"
        subtitle="From mechatronics engineering to full-stack development and AI - a journey of continuous growth and innovation."
      />
      <TimelineSection experiences={experiences} loading={loading} error={error} retry={retry} />
      {!loading && !error && <SummarySection experiences={experiences} />}
    </motion.div>
  )
}

export default Experience
