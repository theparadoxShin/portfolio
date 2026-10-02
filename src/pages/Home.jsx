import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  ArrowRight, ChevronDown, Download, Mail,
  Code2, Cpu, Bot, Cog, Cloud,
  Github, Linkedin, ExternalLink, Smartphone,
} from 'lucide-react'
import SkillsRadar, { DEFAULT_RADAR, toRadarData } from '../components/SkillsRadar'
import CodeTag, { SectionTag } from '../components/CodeTag'
import { CardSkeletonGrid, ErrorState } from '../components/DataState'
import { useProjects, useSkillsRadar } from '../hooks/useApi'
import { usePageMeta } from '../hooks/usePageMeta'
import { getPrimaryImage, getProjectCategory, projectPath, asArray } from '../lib/content'
import {
  COMPANY_URL, EMAIL, GITHUB, LINKEDIN, RESUME_URL, SHORT_NAME,
} from '../data/profile'
import photoBen from '../assets/photo-ben.webp'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const TITLES = ['Full Stack Engineer', 'AI/ML Developer', 'Robotics Engineer', 'IoT Specialist']

/** Types, holds, deletes, moves to the next word. Static rotation when motion is reduced. */
const useTypewriter = (words, { typeMs = 90, deleteMs = 45, holdMs = 1800 } = {}) => {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce) {
      const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), 3500)
      return () => clearInterval(timer)
    }
    const word = words[index]
    let timer
    if (!deleting && text === word) {
      timer = setTimeout(() => setDeleting(true), holdMs)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => (i + 1) % words.length)
    } else {
      timer = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteMs : typeMs,
      )
    }
    return () => clearTimeout(timer)
  }, [text, deleting, index, reduce, words, typeMs, deleteMs, holdMs])

  return reduce ? words[index] : text
}

const heroSocials = [
  { href: GITHUB.url, label: 'GitHub', icon: Github, external: true },
  { href: LINKEDIN.url, label: 'LinkedIn', icon: Linkedin, external: true },
  { href: `mailto:${EMAIL}`, label: 'Email', icon: Mail, external: false },
]

const badges = [
  { label: 'Web/Mobile', icon: Smartphone, color: 'text-green-400', pos: '-top-3 -left-3 sm:-top-4 sm:-left-4', y: [0, 8, 0], d: 3.5 },
  { label: 'AI/ML', icon: Bot, color: 'text-primary', pos: '-top-3 -right-3 sm:-top-4 sm:-right-4', y: [0, -8, 0], d: 3 },
  { label: 'Robotics', icon: Cog, color: 'text-secondary-light', pos: '-bottom-3 -left-3 sm:-bottom-4 sm:-left-4', y: [0, 10, 0], d: 4 },
  { label: 'Cloud', icon: Cloud, color: 'text-cyan-400', pos: '-bottom-3 -right-3 sm:-bottom-4 sm:-right-4', y: [0, -10, 0], d: 3.2 },
]

// Hero Section
const HeroSection = () => {
  const typedText = useTypewriter(TITLES)

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pb-20 pt-28 lg:pb-16">
      {/* Animated gradient backgrounds */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2], x: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="pointer-events-none absolute left-1/4 top-1/4 h-[320px] w-[320px] rounded-full bg-primary/10 blur-[120px] sm:h-[600px] sm:w-[600px] sm:blur-[150px]"
        aria-hidden="true"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15], x: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-[320px] w-[320px] rounded-full bg-secondary/10 blur-[120px] sm:h-[600px] sm:w-[600px] sm:blur-[150px]"
        aria-hidden="true"
      />

      <div className="container-custom relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
          {/* Text Content */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center lg:text-left">
            <motion.div variants={fadeInUp} className="mb-4">
              <CodeTag language="python" size="sm">
                Hello World
              </CodeTag>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mb-4 text-balance font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl xl:text-7xl"
            >
              <span className="text-white">I&apos;m </span>
              <span className="text-gradient">{SHORT_NAME}</span>
            </motion.h1>

            {/* Dynamic title (fixed height: no layout shift while typing) */}
            <motion.div variants={fadeInUp} className="mb-6 flex min-h-[2.5rem] items-center justify-center md:min-h-[3rem] lg:justify-start">
              <p className="font-heading text-xl text-gray-300 sm:text-2xl md:text-3xl">
                <span className="sr-only">{TITLES.join(', ')}</span>
                <span aria-hidden="true">
                  <span className="text-primary">{typedText}</span>
                  <span className="ml-1 animate-blink border-r-2 border-primary">&nbsp;</span>
                </span>
              </p>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-8 max-w-xl text-pretty text-base leading-relaxed text-gray-300 sm:text-lg lg:mx-0"
            >
              Mechatronics Engineer passionate about building intelligent systems
              that bridge the gap between software, hardware, and AI. Based in Edmonton, Alberta, Canada.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="mx-auto flex max-w-sm flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:items-center lg:justify-start"
            >
              <Link to="/contact" className="btn-primary group">
                <span className="flex items-center">
                  Let&apos;s Connect
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} aria-hidden="true" />
                </span>
              </Link>
              <a href={RESUME_URL} download className="btn-outline">
                <Download size={18} className="mr-2" aria-hidden="true" />
                Download CV
                <span className="sr-only"> (PDF)</span>
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.ul variants={fadeInUp} className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
              {heroSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.external ? '_blank' : undefined}
                    rel={social.external ? 'noopener noreferrer' : undefined}
                    aria-label={social.external ? `${social.label} (opens in a new tab)` : social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-gray-300
                               transition-all duration-300 hover:border-primary/50 hover:text-primary"
                  >
                    <social.icon size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Photo/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            {/* Decorative rings */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="h-72 w-72 rounded-full border border-primary/20 sm:h-80 sm:w-80"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute h-[19rem] w-[19rem] rounded-full border border-dashed border-secondary/10 sm:h-96 sm:w-96"
              />
            </div>

            {/* Photo container */}
            <div className="relative z-10">
              <div className="h-60 w-60 overflow-hidden rounded-full border-4 border-primary/30 shadow-glow-lg sm:h-72 sm:w-72 md:h-80 md:w-80">
                <img
                  src={photoBen}
                  alt={`Portrait of ${SHORT_NAME}`}
                  width="600"
                  height="800"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Floating badges */}
              {badges.map((badge) => (
                <motion.div
                  key={badge.label}
                  animate={{ y: badge.y }}
                  transition={{ duration: badge.d, repeat: Infinity }}
                  className={`glass absolute ${badge.pos} flex items-center gap-2 rounded-lg px-3 py-1.5`}
                >
                  <badge.icon className={badge.color} size={16} aria-hidden="true" />
                  <span className="text-xs font-medium text-white">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-gray-400"
        >
          <span className="mb-2 text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}

const expertiseItems = [
  { icon: Code2, text: 'Full-Stack Web & Mobile Development' },
  { icon: Bot, text: 'AI Agents & Machine Learning Models' },
  { icon: Cpu, text: 'IoT Systems & Embedded Solutions' },
  { icon: Cog, text: 'Robotics & Mechatronic Design' },
  { icon: Cloud, text: 'Cloud Architecture & DevOps' },
]

// Skills Preview Section
const SkillsPreview = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const { radar, loading, error } = useSkillsRadar()

  const radarData = useMemo(() => {
    const data = toRadarData(radar)
    return data.length >= 3 ? data : DEFAULT_RADAR
  }, [radar])

  return (
    <section ref={ref} className="relative py-20 sm:py-28" aria-labelledby="home-skills-title">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div>
            <motion.div variants={fadeInUp} className="mb-4">
              <SectionTag>Technical Expertise</SectionTag>
            </motion.div>
            <motion.h2 id="home-skills-title" variants={fadeInUp} className="section-title mb-6">
              Full Stack <span className="text-gradient">Engineer</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mb-8">
              A unique blend of software engineering, AI/ML expertise, and hardware
              knowledge. From web apps to autonomous robots, I bring ideas to life.
            </motion.p>

            <motion.ul variants={fadeInUp} className="mb-8 space-y-4">
              {expertiseItems.map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-gray-200">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10" aria-hidden="true">
                    <item.icon className="text-primary" size={16} />
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp}>
              <Link to="/skills" className="btn-outline">
                <span>View All Skills</span>
                <ArrowRight className="ml-2" size={18} aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {/* Radar Chart */}
          <motion.div variants={fadeInUp} className="flex justify-center">
            {loading && !error ? (
              <div className="flex aspect-square w-full max-w-[440px] items-center justify-center" role="status">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/25 border-t-primary" aria-hidden="true" />
                <span className="sr-only">Loading skills chart…</span>
              </div>
            ) : (
              <SkillsRadar data={radarData} maxSize={440} />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const FeaturedProjectCard = ({ project }) => {
  const image = getPrimaryImage(project)
  const category = getProjectCategory(project.category)
  const technologies = asArray(project.technologies)

  return (
    <motion.li variants={fadeInUp} whileHover={{ y: -6 }} className="card-glow group h-full rounded-xl">
      <Link to={projectPath(project)} className="card flex h-full flex-col">
        <div
          className={`mb-6 flex h-48 items-center justify-center overflow-hidden rounded-lg ${
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
        </div>

        <h3 className="mb-3 font-heading text-xl font-semibold text-white transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        {(project.shortDescription || project.description) && (
          <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-300">
            {project.shortDescription || project.description}
          </p>
        )}

        {technologies.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2" aria-label="Technologies">
            {technologies.slice(0, 4).map((tag) => (
              <li key={tag} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </motion.li>
  )
}

// Featured Projects Section
const FeaturedProjects = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const { projects, loading, error, retry } = useProjects()

  const featuredProjects = useMemo(() => {
    const featured = projects.filter((p) => p.featured)
    return (featured.length > 0 ? featured : projects).slice(0, 3)
  }, [projects])

  // Nothing published yet: keep the home page clean.
  if (!loading && !error && featuredProjects.length === 0) return null

  return (
    <section ref={ref} className="relative py-20 sm:py-28" aria-labelledby="home-projects-title">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent" aria-hidden="true" />

      <div className="container-custom relative">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="mb-12 text-center sm:mb-16"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <SectionTag>Portfolio</SectionTag>
          </motion.div>
          <motion.h2 id="home-projects-title" variants={fadeInUp} className="section-title mb-6">
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            A selection of recent work showcasing my expertise across different domains.
          </motion.p>
        </motion.div>

        {loading && <CardSkeletonGrid count={3} withMedia label="Loading featured projects…" cardClassName="h-[26rem]" />}

        {!loading && error && (
          <ErrorState compact title="Projects could not be loaded" message={error} onRetry={retry} />
        )}

        {!loading && !error && (
          <motion.ul
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={stagger}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          >
            {featuredProjects.map((project) => (
              <FeaturedProjectCard key={project.id || project.slug || project.title} project={project} />
            ))}
          </motion.ul>
        )}

        <div className="mt-12 text-center">
          <Link to="/projects" className="btn-outline">
            <span>View All Projects</span>
            <ArrowRight className="ml-2" size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section ref={ref} className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="home-cta-title">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />
        <div className="absolute inset-0 grid-bg opacity-50" />
      </div>

      <div className="container-custom relative z-10 text-center">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}>
          <motion.h2
            id="home-cta-title"
            variants={fadeInUp}
            className="mb-6 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            <span className="text-white">Let&apos;s Build Something</span>
            <br />
            <span className="text-gradient">Amazing Together</span>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-gray-300 sm:text-xl">
            Whether it&apos;s an AI project, a web application, or a robotics challenge,
            I&apos;m ready to bring your vision to life.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mx-auto flex max-w-sm flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:items-center"
          >
            <Link to="/contact" className="btn-primary px-8 py-4 text-lg sm:px-10">
              <span className="flex items-center justify-center">
                Start a Conversation
                <ArrowRight className="ml-3" size={20} aria-hidden="true" />
              </span>
            </Link>
            <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Visit Daemon Craft
              <ExternalLink className="ml-2" size={18} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        aria-hidden="true"
      />
    </section>
  )
}

// Main Home Component
const Home = () => {
  usePageMeta()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <HeroSection />
      <SkillsPreview />
      <FeaturedProjects />
      <CTASection />
    </motion.div>
  )
}

export default Home
