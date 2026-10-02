import { forwardRef, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Layers, ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import { CardSkeletonGrid, EmptyState, ErrorState } from '../components/DataState'
import { useProjects } from '../hooks/useApi'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  PROJECT_CATEGORIES, PROJECT_STATUS, asArray, getPrimaryImage, getProjectCategory, projectPath, safeUrl,
} from '../lib/content'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

// Project Card — the title link covers the whole card; external links sit above it.
const ProjectCard = forwardRef(({ project, index }, ref) => {
  const category = getProjectCategory(project.category)
  const image = getPrimaryImage(project)
  const technologies = asArray(project.technologies)
  const githubUrl = safeUrl(project.githubUrl)
  const liveUrl = safeUrl(project.liveUrl)
  const status = PROJECT_STATUS[project.status]

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.06 }}
      className="card-glow group h-full rounded-xl"
    >
      <article className="card relative flex h-full flex-col">
        <div
          className={`relative mb-6 flex h-48 items-center justify-center overflow-hidden rounded-lg ${
            image ? 'bg-dark' : `bg-gradient-to-br ${category.gradient}`
          }`}
        >
          {image ? (
            <img
              src={image.url}
              alt={image.alt || ''}
              width="640"
              height="384"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <category.icon className="text-white/40" size={56} aria-hidden="true" />
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {project.featured && (
              <span className="rounded-full bg-dark/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                Featured
              </span>
            )}
            {status && (
              <span className="rounded-full bg-dark/75 px-2.5 py-1 text-xs font-medium text-gray-100 backdrop-blur-sm">
                {status.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">{category.label}</p>
          <h3 className="mb-3 font-heading text-xl font-semibold text-white transition-colors group-hover:text-primary">
            <Link
              to={projectPath(project)}
              className="rounded after:absolute after:inset-0 after:rounded-xl after:content-['']"
            >
              {project.title}
            </Link>
          </h3>
          {(project.shortDescription || project.description) && (
            <p className="mb-4 line-clamp-3 text-sm text-gray-300">
              {project.shortDescription || project.description}
            </p>
          )}

          {technologies.length > 0 && (
            <ul className="mb-5 flex flex-wrap gap-2" aria-label="Technologies">
              {technologies.slice(0, 4).map((tag) => (
                <li key={tag} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  {tag}
                </li>
              ))}
              {technologies.length > 4 && (
                <li className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-300">
                  +{technologies.length - 4}
                  <span className="sr-only"> more</span>
                </li>
              )}
            </ul>
          )}

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/5 pt-4">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary" aria-hidden="true">
              View details
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
            <div className="relative z-10 flex items-center gap-2">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} source code on GitHub (opens in a new tab)`}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-gray-300
                             transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Github size={18} aria-hidden="true" />
                </a>
              )}
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live demo (opens in a new tab)`}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-gray-300
                             transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </motion.li>
  )
})
ProjectCard.displayName = 'ProjectCard'

// Projects Grid Section
const ProjectsGridSection = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const { projects, loading, error, retry } = useProjects()

  // Filters only for categories that actually have projects (known ones first).
  const filters = useMemo(() => {
    const present = [...new Set(projects.map((p) => p.category).filter(Boolean))]
    const ordered = [
      ...Object.keys(PROJECT_CATEGORIES).filter((key) => present.includes(key)),
      ...present.filter((key) => !PROJECT_CATEGORIES[key]),
    ]
    return [
      { key: 'all', label: 'All Projects', icon: Layers, count: projects.length },
      ...ordered.map((key) => ({
        key,
        ...getProjectCategory(key),
        count: projects.filter((p) => p.category === key).length,
      })),
    ]
  }, [projects])

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  if (loading) {
    return (
      <section className="py-12 sm:py-20" aria-label="Projects">
        <div className="container-custom">
          <CardSkeletonGrid count={6} withMedia label="Loading projects…" cardClassName="h-[28rem]" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 sm:py-20" aria-label="Projects">
        <div className="container-custom">
          <ErrorState title="Projects could not be loaded" message={error} onRetry={retry} />
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="py-12 sm:py-20" aria-label="Projects">
        <div className="container-custom">
          <EmptyState icon={Layers} title="Projects Coming Soon">
            Projects are not yet available or the section is currently under maintenance.
            Please check back later!
          </EmptyState>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-20" aria-labelledby="projects-list-title">
      <div className="container-custom">
        <h2 id="projects-list-title" className="sr-only">Project list</h2>

        {filters.length > 2 && (
          <div role="group" aria-label="Filter projects by category" className="mb-10 flex flex-wrap justify-center gap-2 sm:mb-12 sm:gap-3">
            {filters.map((filter) => {
              const active = activeCategory === filter.key
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveCategory(filter.key)}
                  aria-pressed={active}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? 'bg-primary text-dark'
                      : 'border border-white/10 bg-dark-light/50 text-gray-300 hover:bg-dark-light hover:text-white'
                  }`}
                >
                  <filter.icon size={16} aria-hidden="true" />
                  <span>{filter.label}</span>
                  <span className={`text-xs ${active ? 'text-dark/70' : 'text-gray-400'}`}>({filter.count})</span>
                </button>
              )
            })}
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {`${filteredProjects.length} project${filteredProjects.length === 1 ? '' : 's'} shown`}
        </p>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id || project.slug || project.title} project={project} index={index} />
            ))}
          </AnimatePresence>
        </ul>

        {filteredProjects.length === 0 && (
          <div className="py-16 text-center">
            <Layers className="mx-auto mb-4 text-gray-500" size={48} aria-hidden="true" />
            <p className="text-gray-300">No projects in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}

const stats = [
  { value: '20+', label: 'Projects Completed' },
  { value: '15+', label: 'Happy Clients' },
  { value: '5+', label: 'Open Source' },
  { value: '4', label: 'Hackathon Finals/Wins' },
]

// Stats Section
const StatsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section ref={ref} className="relative py-16 sm:py-20" aria-label="Key figures">
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

// Main Projects Component
const Projects = () => {
  usePageMeta({
    title: 'Projects',
    description: 'Projects by Parfait Tedom Tedom across AI agents, IoT, robotics, web and mobile development.',
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHero
        tag="Portfolio"
        title="My"
        highlight="Projects"
        subtitle="A collection of work showcasing my expertise across AI, IoT, robotics, and software development."
      />
      <ProjectsGridSection />
      <StatsSection />
    </motion.div>
  )
}

export default Projects
