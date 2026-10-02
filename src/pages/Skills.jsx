import { Fragment, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Code2, Server, Brain, Cpu, Cog, PenTool, Cloud, CircuitBoard,
  CheckCircle, Star, Database, Smartphone, Workflow,
} from 'lucide-react'
import SkillsRadar, { toRadarData } from '../components/SkillsRadar'
import PageHero from '../components/PageHero'
import { CardSkeletonGrid, EmptyState, ErrorState } from '../components/DataState'
import { useSkills, useSkillsRadar } from '../hooks/useApi'
import { usePageMeta } from '../hooks/usePageMeta'
import { asArray } from '../lib/content'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

// Category metadata (fallbacks when the API does not provide them)
const CATEGORY_META = {
  frontend: { icon: Code2, color: '#3B82F6', name: 'Frontend Development', description: 'Building responsive and interactive user interfaces' },
  backend: { icon: Server, color: '#10B981', name: 'Backend Development', description: 'Designing scalable server-side architectures' },
  'ai-ml': { icon: Brain, color: '#8B5CF6', name: 'AI & Machine Learning', description: 'Building intelligent systems and AI agents' },
  iot: { icon: Cpu, color: '#F59E0B', name: 'IoT Systems', description: 'Connected devices and smart systems' },
  robotics: { icon: Cog, color: '#EF4444', name: 'Robotics', description: 'Autonomous systems and mechatronics' },
  cad: { icon: PenTool, color: '#EC4899', name: 'CAD & Design', description: 'Mechanical design and 3D modeling' },
  cloud: { icon: Cloud, color: '#06B6D4', name: 'Cloud & DevOps', description: 'Cloud infrastructure and deployment' },
  embedded: { icon: CircuitBoard, color: '#6366F1', name: 'Embedded Systems', description: 'Low-level programming and firmware' },
  database: { icon: Database, color: '#14B8A6', name: 'Databases', description: 'Database design and management' },
  devops: { icon: Workflow, color: '#F97316', name: 'DevOps', description: 'CI/CD and infrastructure automation' },
  mobile: { icon: Smartphone, color: '#A78BFA', name: 'Mobile Development', description: 'Mobile application development' },
  other: { icon: Star, color: '#9CA3AF', name: 'Other Skills', description: 'Additional technical skills' },
}

const level = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)))

/** Groups API skills by category; a category's "main" skill is its radar skill. */
const transformSkillsToCategories = (apiSkills) => {
  const grouped = asArray(apiSkills).reduce((acc, skill) => {
    if (!skill) return acc
    const category = skill.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  return Object.entries(grouped).map(([key, skills]) => {
    const meta = CATEGORY_META[key] || CATEGORY_META.other
    const mainSkill = skills.find((s) => s.isRadarSkill)
    const avgLevel = skills.reduce((sum, s) => sum + level(s.level), 0) / skills.length
    const subSkills = asArray(mainSkill?.subSkills)

    const displaySkills = (subSkills.length > 0 ? subSkills : skills.filter((s) => !s.isRadarSkill))
      .filter((s) => s?.name)
      .map((s) => ({ name: s.name, level: level(s.level) }))
      .sort((a, b) => b.level - a.level)

    return {
      key,
      name: CATEGORY_META[key]?.name || mainSkill?.name || key,
      icon: meta.icon,
      color: mainSkill?.color || meta.color,
      level: mainSkill ? level(mainSkill.level) : Math.round(avgLevel),
      description: mainSkill?.description || meta.description,
      skills: displaySkills,
    }
  }).sort((a, b) => b.level - a.level)
}

// Radar Section
const RadarSection = () => {
  const { radar, loading, error } = useSkillsRadar()
  const radarData = useMemo(() => toRadarData(radar), [radar])

  // The detailed grid below has its own error/empty states.
  if (!loading && (error || radarData.length < 3)) return null

  return (
    <section className="pb-8 sm:pb-12" aria-label="Skills overview chart">
      <div className="container-custom flex justify-center">
        {loading ? (
          <div className="flex aspect-square w-full max-w-[480px] items-center justify-center" role="status">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/25 border-t-primary" aria-hidden="true" />
            <span className="sr-only">Loading skills chart…</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex w-full justify-center"
          >
            <SkillsRadar data={radarData} maxSize={480} />
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Skill Category Card (a toggle button: selects the category shown in the detail panel)
const SkillCategoryCard = ({ category, isSelected, onClick, panelId }) => (
  <motion.button
    type="button"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    aria-expanded={isSelected}
    aria-controls={panelId}
    className={`card w-full text-left transition-all duration-300 ${
      isSelected ? 'bg-dark-light/80 ring-2 ring-primary' : ''
    }`}
  >
    <span className="mb-4 flex items-start justify-between">
      <span
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${category.color}20` }}
        aria-hidden="true"
      >
        <category.icon style={{ color: category.color }} size={24} />
      </span>
      <span className="font-display text-2xl font-bold" style={{ color: category.color }}>
        {category.level}%
      </span>
    </span>

    <span className="mb-2 block font-heading text-lg font-semibold text-white">{category.name}</span>
    <span className="block text-sm text-gray-300">{category.description}</span>

    <span className="mt-4 block h-1.5 overflow-hidden rounded-full bg-dark" aria-hidden="true">
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: `${category.level}%` }}
        transition={{ duration: 1, delay: 0.2 }}
        className="block h-full rounded-full"
        style={{ backgroundColor: category.color }}
      />
    </span>
  </motion.button>
)

// Skills Detail Panel
const SkillsDetailPanel = ({ category, id, inline = false }) => {
  if (!category) return null

  return (
    <motion.div
      key={category.key}
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-tech p-6 sm:p-8"
      aria-live="polite"
    >
      <div className={inline ? 'sr-only' : 'mb-6 flex items-center gap-4 sm:mb-8'}>
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl sm:h-16 sm:w-16"
          style={{ backgroundColor: `${category.color}20` }}
          aria-hidden="true"
        >
          <category.icon style={{ color: category.color }} size={30} />
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">{category.name}</h3>
          <p className="text-sm text-gray-300 sm:text-base">{category.description}</p>
        </div>
      </div>

      {category.skills.length === 0 ? (
        <p className="text-sm text-gray-300">Details for this area are coming soon.</p>
      ) : (
        <ul className="space-y-4">
          {category.skills.map((skill, index) => (
            <motion.li
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center font-medium text-white">
                  <CheckCircle size={14} className="mr-2 shrink-0" style={{ color: category.color }} aria-hidden="true" />
                  <span className="truncate">{skill.name}</span>
                </span>
                <span className="shrink-0 text-sm text-gray-300">{skill.level}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-dark" aria-hidden="true">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, delay: index * 0.06 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

// Skills Grid Section
const SkillsGridSection = () => {
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true })
  const { skills: apiSkills, loading, error, retry } = useSkills()
  const skillCategories = useMemo(() => transformSkillsToCategories(apiSkills), [apiSkills])
  const [selectedKey, setSelectedKey] = useState(null)

  const selectedCategory = skillCategories.find((cat) => cat.key === selectedKey) || skillCategories[0]

  if (loading) {
    return (
      <section className="py-12 sm:py-20" aria-label="Skill categories">
        <div className="container-custom">
          <CardSkeletonGrid count={4} label="Loading skills…" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" cardClassName="h-52" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 sm:py-20" aria-label="Skill categories">
        <div className="container-custom">
          <ErrorState title="Skills could not be loaded" message={error} onRetry={retry} />
        </div>
      </section>
    )
  }

  if (skillCategories.length === 0) {
    return (
      <section className="py-12 sm:py-20" aria-label="Skill categories">
        <div className="container-custom">
          <EmptyState icon={Code2} title="Skills Coming Soon">
            Skills information is not yet available or the section is currently under maintenance.
            Please check back later!
          </EmptyState>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="py-12 sm:py-20" aria-labelledby="skills-categories-title">
      <div className="container-custom">
        <h2 id="skills-categories-title" className="sr-only">Skill categories</h2>
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid gap-8 lg:grid-cols-3"
        >
          {/* Categories grid. Below lg the details open inline under the selected card. */}
          <motion.div variants={fadeInUp} className="grid grid-flow-row-dense gap-4 sm:grid-cols-2 lg:col-span-2">
            {skillCategories.map((category) => {
              const isSelected = selectedCategory?.key === category.key
              return (
                <Fragment key={category.key}>
                  <SkillCategoryCard
                    category={category}
                    isSelected={isSelected}
                    panelId={`skill-panel-${category.key}`}
                    onClick={() => setSelectedKey(category.key)}
                  />
                  {isSelected && (
                    <div className="sm:col-span-2 lg:hidden">
                      <SkillsDetailPanel category={category} id={`skill-panel-${category.key}`} inline />
                    </div>
                  )}
                </Fragment>
              )
            })}
          </motion.div>

          {/* Detail panel (desktop) */}
          <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-24">
              <SkillsDetailPanel category={selectedCategory} id={`skill-panel-desktop-${selectedCategory?.key}`} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const tools = [
  'VS Code', 'Git', 'Docker', 'Postman', 'Figma', 'Jira',
  'Notion', 'Slack', 'Terminal', 'Linux', 'GitHub', 'AWS Console',
  'Firebase', 'MongoDB Atlas', 'Vercel', 'Netlify',
]

// Tools Section
const ToolsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="relative py-16 sm:py-20" aria-labelledby="tools-title">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent" aria-hidden="true" />

      <div className="container-custom relative">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="mb-10 text-center sm:mb-12"
        >
          <motion.p variants={fadeInUp} className="section-tag mb-4">
            Tools & Platforms
          </motion.p>
          <motion.h2 id="tools-title" variants={fadeInUp} className="section-title mb-6">
            Daily <span className="text-gradient">Toolkit</span>
          </motion.h2>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
          className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3"
        >
          {tools.map((tool) => (
            <motion.li
              key={tool}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              className="cursor-default rounded-lg border border-white/10 bg-dark-light/50 px-4 py-2 text-sm font-medium
                         text-gray-200 transition-colors duration-300 hover:border-primary/50 hover:text-primary"
            >
              {tool}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

// Main Skills Component
const Skills = () => {
  usePageMeta({
    title: 'Skills',
    description: 'Technical skills of Parfait Tedom Tedom across frontend, backend, AI/ML, IoT, robotics, embedded systems, CAD and cloud.',
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHero
        tag="Technical Skills"
        title="My"
        highlight="Expertise"
        subtitle="A comprehensive toolkit spanning software, hardware, and artificial intelligence."
      />
      <RadarSection />
      <SkillsGridSection />
      <ToolsSection />
    </motion.div>
  )
}

export default Skills
