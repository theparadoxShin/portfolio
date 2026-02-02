import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Code2, Server, Brain, Cpu, Cog, PenTool, Cloud, CircuitBoard,
  CheckCircle, Star
} from 'lucide-react'
import SkillsRadar from '../components/SkillsRadar'
import { useSkills } from '../hooks/useApi'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Category icon mapping
const categoryIcons = {
  frontend: Code2,
  backend: Server,
  'ai-ml': Brain,
  iot: Cpu,
  robotics: Cog,
  cad: PenTool,
  cloud: Cloud,
  embedded: CircuitBoard,
  database: Server,
  devops: Cloud,
  mobile: Code2,
  other: Star
}

// Category color mapping
const categoryColors = {
  frontend: '#3B82F6',
  backend: '#10B981',
  'ai-ml': '#8B5CF6',
  iot: '#F59E0B',
  robotics: '#EF4444',
  cad: '#EC4899',
  cloud: '#06B6D4',
  embedded: '#6366F1',
  database: '#14B8A6',
  devops: '#F97316',
  mobile: '#8B5CF6',
  other: '#6B7280'
}

// Category descriptions
const categoryDescriptions = {
  frontend: 'Building responsive and interactive user interfaces',
  backend: 'Designing scalable server-side architectures',
  'ai-ml': 'Building intelligent systems and AI agents',
  iot: 'Connected devices and smart systems',
  robotics: 'Autonomous systems and mechatronics',
  cad: 'Mechanical design and 3D modeling',
  cloud: 'Cloud infrastructure and deployment',
  embedded: 'Low-level programming and firmware',
  database: 'Database design and management',
  devops: 'CI/CD and infrastructure automation',
  mobile: 'Mobile application development',
  other: 'Additional technical skills'
}

// Category display names
const categoryNames = {
  frontend: 'Frontend Development',
  backend: 'Backend Development',
  'ai-ml': 'AI & Machine Learning',
  iot: 'IoT Systems',
  robotics: 'Robotics',
  cad: 'CAD & Design',
  cloud: 'Cloud & DevOps',
  embedded: 'Embedded Systems',
  database: 'Databases',
  devops: 'DevOps',
  mobile: 'Mobile Development',
  other: 'Other Skills'
}

// Function to transform API skills to category format
const transformSkillsToCategories = (apiSkills) => {
  if (!apiSkills || apiSkills.length === 0) return []
  
  // Group skills by category
  const grouped = apiSkills.reduce((acc, skill) => {
    const category = skill.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {})
  
  // Transform to category format
  return Object.entries(grouped).map(([categoryKey, skills]) => {
    // Find the main category skill (isRadarSkill) or calculate average
    const mainSkill = skills.find(s => s.isRadarSkill)
    const avgLevel = mainSkill?.level || Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length)
    
    // If main skill has subSkills, use those; otherwise use non-radar skills
    let displaySkills = []
    if (mainSkill?.subSkills && mainSkill.subSkills.length > 0) {
      displaySkills = mainSkill.subSkills.map(s => ({
        name: s.name,
        level: s.level
      }))
    } else {
      displaySkills = skills
        .filter(s => !s.isRadarSkill)
        .map(s => ({
          name: s.name,
          level: s.level
        }))
    }
    
    return {
      key: categoryKey,
      name: categoryNames[categoryKey] || categoryKey,
      icon: categoryIcons[categoryKey] || Star,
      color: categoryColors[categoryKey] || '#6B7280',
      level: avgLevel,
      description: categoryDescriptions[categoryKey] || 'Technical skills',
      skills: displaySkills.sort((a, b) => (b.level || 0) - (a.level || 0))
    }
  }).sort((a, b) => b.level - a.level)
}

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center"
        >
          <motion.p variants={fadeInUp} className="section-tag mb-4">
            Technical Skills
          </motion.p>
          <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">My</span>{' '}
            <span className="text-gradient">Expertise</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive toolkit spanning software, hardware, and artificial intelligence.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// Radar Section
const RadarSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const { skills: apiSkills, loading } = useSkills()
  
  // Build radar skills from API only
  const radarSkills = useMemo(() => {
    if (apiSkills?.length > 0) {
      const radarItems = apiSkills.filter(s => s.isRadarSkill)
      if (radarItems.length > 0) {
        return radarItems.reduce((acc, skill) => {
          acc[skill.category] = skill.level
          return acc
        }, {})
      }
    }
    return null
  }, [apiSkills])

  // Don't render if no radar skills
  if (!loading && !radarSkills) return null

  return (
    <section ref={ref} className="py-20">
      <div className="container-custom">
        {radarSkills && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-8"
            >
              <SkillsRadar skills={radarSkills} size={450} animated={inView} />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="text-center text-gray-500 text-sm"
            >
              Hover over the chart to see skill levels
            </motion.p>
          </>
        )}
      </div>
    </section>
  )
}

// Skill Category Card
const SkillCategoryCard = ({ category, isSelected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`card cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary bg-dark-light/80' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <category.icon style={{ color: category.color }} size={24} />
        </div>
        <span 
          className="text-2xl font-display font-bold"
          style={{ color: category.color }}
        >
          {category.level}%
        </span>
      </div>
      
      <h3 className="font-heading text-lg font-semibold text-white mb-2">
        {category.name}
      </h3>
      <p className="text-gray-400 text-sm">
        {category.description}
      </p>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-dark rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${category.level}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: category.color }}
        />
      </div>
    </motion.div>
  )
}

// Skills Detail Panel
const SkillsDetailPanel = ({ category }) => {
  if (!category) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card-tech p-8"
    >
      <div className="flex items-center space-x-4 mb-8">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <category.icon style={{ color: category.color }} size={32} />
        </div>
        <div>
          <h3 className="font-heading text-2xl font-bold text-white">
            {category.name}
          </h3>
          <p className="text-gray-400">{category.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {category.skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium flex items-center">
                <CheckCircle 
                  size={14} 
                  className="mr-2" 
                  style={{ color: category.color }}
                />
                {skill.name}
              </span>
              <span className="text-gray-400 text-sm">{skill.level}%</span>
            </div>
            <div className="h-2 bg-dark rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: category.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Skills Grid Section
const SkillsGridSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const { skills: apiSkills, loading } = useSkills()
  
  // Transform API skills to category format
  const skillCategories = useMemo(() => {
    return transformSkillsToCategories(apiSkills)
  }, [apiSkills])
  
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null)
  
  // Set initial selection when categories load
  useEffect(() => {
    if (skillCategories.length > 0 && !selectedCategoryKey) {
      setSelectedCategoryKey(skillCategories[0].key)
    }
  }, [skillCategories, selectedCategoryKey])
  
  // Get selected category from key
  const selectedCategory = useMemo(() => {
    return skillCategories.find(cat => cat.key === selectedCategoryKey) || skillCategories[0]
  }, [skillCategories, selectedCategoryKey])

  // Empty state
  if (!loading && skillCategories.length === 0) {
    return (
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Code2 className="text-primary" size={48} />
            </div>
            <h3 className="font-heading text-2xl font-bold text-white mb-4">
              Skills Coming Soon
            </h3>
            <p className="text-gray-400 max-w-lg mx-auto">
              Skills information is not yet available or the section is currently under maintenance. 
              Please check back later!
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="py-20">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Categories Grid */}
          <div className="lg:col-span-2">
            <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4">
              {skillCategories.map((category) => (
                <SkillCategoryCard
                  key={category.key}
                  category={category}
                  isSelected={selectedCategoryKey === category.key}
                  onClick={() => setSelectedCategoryKey(category.key)}
                />
              ))}
            </motion.div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SkillsDetailPanel category={selectedCategory} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Tools Section
const ToolsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const tools = [
    'VS Code', 'Git', 'Docker', 'Postman', 'Figma', 'Jira',
    'Notion', 'Slack', 'Terminal', 'Linux', 'GitHub', 'AWS Console',
    'Firebase', 'MongoDB Atlas', 'Vercel', 'Netlify'
  ]

  return (
    <section ref={ref} className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent" />
      
      <div className="container-custom relative">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.p variants={fadeInUp} className="section-tag mb-4">
            Tools & Platforms
          </motion.p>
          <motion.h2 variants={fadeInUp} className="section-title mb-6">
            Daily <span className="text-gradient">Toolkit</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="flex flex-wrap justify-center gap-3"
        >
          {tools.map((tool, index) => (
            <motion.span
              key={tool}
              variants={fadeInUp}
              whileHover={{ scale: 1.1, y: -2 }}
              className="px-4 py-2 rounded-lg bg-dark-light/50 border border-white/10
                        text-gray-300 text-sm font-medium hover:border-primary/50
                        hover:text-primary transition-all duration-300 cursor-default"
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Main Skills Component
const Skills = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection />
      <RadarSection />
      <SkillsGridSection />
      <ToolsSection />
    </motion.div>
  )
}

export default Skills
