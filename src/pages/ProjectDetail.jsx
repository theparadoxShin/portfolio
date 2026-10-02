import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Calendar, ExternalLink, Github, PlayCircle, Quote, Tag, Briefcase,
} from 'lucide-react'
import { ErrorState } from '../components/DataState'
import NotFound from './NotFound'
import { useProject } from '../hooks/useApi'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  PROJECT_STATUS, asArray, formatDateRange, getProjectCategory, safeUrl,
} from '../lib/content'

const Loading = () => (
  <div className="container-custom pb-16 pt-28 sm:pt-32" role="status" aria-live="polite">
    <span className="sr-only">Loading project…</span>
    <div className="animate-pulse space-y-6" aria-hidden="true">
      <div className="h-5 w-32 rounded bg-white/10" />
      <div className="h-12 w-3/4 max-w-xl rounded bg-white/10" />
      <div className="h-5 w-1/2 max-w-md rounded bg-white/5" />
      <div className="aspect-video w-full max-w-4xl rounded-xl bg-white/5" />
    </div>
  </div>
)

const ProjectDetail = () => {
  const { slug } = useParams()
  const { project, loading, error, status, retry } = useProject(slug)
  const [activeImage, setActiveImage] = useState(0)
  const notFound = status === 404

  // NotFound sets its own (noindex) meta; avoid two hooks fighting over the title.
  usePageMeta(notFound ? { title: 'Project not found', noindex: true } : {
    title: project?.title || 'Project',
    description: project?.shortDescription || project?.description?.slice(0, 160),
  })

  if (loading) return <Loading />

  if (status === 404) {
    return (
      <NotFound
        title="Project not found"
        message="This project doesn't exist or is no longer published."
      />
    )
  }

  if (error || !project) {
    return (
      <div className="container-custom pb-16 pt-28 sm:pt-32">
        <ErrorState title="This project could not be loaded" message={error} onRetry={retry} />
        <p className="mt-8 text-center">
          <Link to="/projects" className="btn-outline">
            <ArrowLeft size={18} className="mr-2" aria-hidden="true" />
            All projects
          </Link>
        </p>
      </div>
    )
  }

  const category = getProjectCategory(project.category)
  const projectStatus = PROJECT_STATUS[project.status]
  const images = asArray(project.images).filter((img) => safeUrl(img?.url))
  const primaryIndex = Math.max(0, images.findIndex((img) => img.isPrimary))
  const shown = images[activeImage] || images[primaryIndex] || null
  const technologies = asArray(project.technologies)
  const githubUrl = safeUrl(project.githubUrl)
  const liveUrl = safeUrl(project.liveUrl)
  const videoUrl = safeUrl(project.videoUrl)
  const dates = formatDateRange(project.startDate, project.endDate, project.status === 'in-progress')
  const testimonial = project.testimonial?.text ? project.testimonial : null

  return (
    <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Header */}
      <header className="relative overflow-hidden pb-10 pt-28 sm:pt-32">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute inset-0 grid-bg opacity-30" />
        </div>
        <div className="container-custom relative z-10">
          <Link
            to="/projects"
            className="mb-8 inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-300 transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            All projects
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <category.icon size={14} aria-hidden="true" />
              {category.label}
            </span>
            {projectStatus && (
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${projectStatus.className}`}>
                {projectStatus.label}
              </span>
            )}
            {project.featured && (
              <span className="rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary-light">
                Featured
              </span>
            )}
          </div>

          <h1 className="mb-4 max-w-4xl text-balance font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {project.title}
          </h1>
          {project.shortDescription && (
            <p className="max-w-3xl text-pretty text-lg text-gray-300 sm:text-xl">{project.shortDescription}</p>
          )}

          {(githubUrl || liveUrl || videoUrl) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <span className="flex items-center justify-center">
                    <ExternalLink size={18} className="mr-2" aria-hidden="true" />
                    Live demo
                    <span className="sr-only"> (opens in a new tab)</span>
                  </span>
                </a>
              )}
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <Github size={18} className="mr-2" aria-hidden="true" />
                  Source code
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
              {videoUrl && (
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <PlayCircle size={18} className="mr-2" aria-hidden="true" />
                  Watch video
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="container-custom pb-8">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          {/* Main column */}
          <div className="min-w-0 lg:col-span-2">
            <figure className="mb-8">
              <div
                className={`flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-white/10 ${
                  shown ? 'bg-dark-light' : `bg-gradient-to-br ${category.gradient}`
                }`}
              >
                {shown ? (
                  <img
                    src={shown.url}
                    alt={shown.alt || `${project.title} screenshot`}
                    width="1280"
                    height="720"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <category.icon className="text-white/40" size={80} aria-hidden="true" />
                )}
              </div>
              {images.length > 1 && (
                <ul className="mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Project images">
                  {images.map((img, i) => {
                    const selected = img === shown
                    return (
                      <li key={img.url} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveImage(i)}
                          aria-pressed={selected}
                          aria-label={`Show image ${i + 1}${img.alt ? `: ${img.alt}` : ''}`}
                          className={`block h-16 w-24 overflow-hidden rounded-lg border-2 transition-colors sm:h-20 sm:w-32 ${
                            selected ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img.url} alt="" width="128" height="80" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </figure>

            {project.description && (
              <section aria-labelledby="project-overview">
                <h2 id="project-overview" className="mb-4 font-heading text-2xl font-semibold text-white">Overview</h2>
                <p className="max-w-prose whitespace-pre-line leading-relaxed text-gray-300">{project.description}</p>
              </section>
            )}

            {testimonial && (
              <figure className="glass-card mt-10 p-6 sm:p-8">
                <Quote className="mb-4 text-primary" size={28} aria-hidden="true" />
                <blockquote className="mb-4 whitespace-pre-line text-lg italic leading-relaxed text-gray-200">
                  {testimonial.text}
                </blockquote>
                {(testimonial.author || testimonial.role) && (
                  <figcaption className="text-sm text-gray-300">
                    {testimonial.author && <span className="font-semibold text-white">{testimonial.author}</span>}
                    {testimonial.author && testimonial.role && ', '}
                    {testimonial.role}
                  </figcaption>
                )}
              </figure>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1" aria-label="Project details">
            <div className="glass-card space-y-6 p-6 lg:sticky lg:top-24">
              {technologies.length > 0 && (
                <div>
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-300">
                    <Tag size={14} aria-hidden="true" />
                    Technologies
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <li key={tech} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">{tech}</li>
                    ))}
                  </ul>
                </div>
              )}

              {dates && (
                <div>
                  <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-300">
                    <Calendar size={14} aria-hidden="true" />
                    Timeline
                  </h2>
                  <p className="text-white">{dates}</p>
                </div>
              )}

              {project.clientName && (
                <div>
                  <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-300">
                    <Briefcase size={14} aria-hidden="true" />
                    Client
                  </h2>
                  <p className="text-white">{project.clientName}</p>
                </div>
              )}

              <div className="border-t border-white/10 pt-6">
                <Link to="/contact" className="btn-primary w-full">
                  <span>Discuss a similar project</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectDetail
