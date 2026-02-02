import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ExternalLink, Github, Layers, Filter,
  Bot, Smartphone, Cpu, Cog, Globe, Code2
} from 'lucide-react'
import { useProjects } from '../hooks/useApi'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Categories
const categories = [
  { key: 'all', label: 'All Projects', icon: Layers },
  { key: 'ai-agent', label: 'AI Agents', icon: Bot },
  { key: 'chatbot', label: 'Chatbots', icon: Bot },
  { key: 'iot', label: 'IoT', icon: Cpu },
  { key: 'robotics', label: 'Robotics', icon: Cog },
  { key: 'web', label: 'Web', icon: Globe },
  { key: 'mobile', label: 'Mobile', icon: Smartphone },
  { key: 'embedded', label: 'Embedded', icon: Cpu },
  { key: 'cad', label: 'CAD/3D', icon: Code2 },
  { key: 'other', label: 'Other', icon: Layers },
]

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
            Portfolio
          </motion.p>
          <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">My</span>{' '}
            <span className="text-gradient">Projects</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-400 max-w-3xl mx-auto">
            A collection of work showcasing my expertise across AI, IoT, robotics, and software development.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// Project Card
const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const colorMap = {
    'ai-agent': 'from-orange-500 to-red-600',
    'chatbot': 'from-purple-500 to-pink-600',
    'iot': 'from-green-500 to-teal-600',
    'robotics': 'from-red-500 to-orange-600',
    'web': 'from-cyan-500 to-blue-600',
    'mobile': 'from-blue-500 to-purple-600',
    'embedded': 'from-yellow-500 to-orange-600',
    'cad': 'from-pink-500 to-rose-600',
  }
  const color = colorMap[project.category] || 'from-gray-500 to-gray-600'
  
  // Get primary image or first image
  const primaryImage = project.images?.find(img => img.isPrimary) || project.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-glow group"
    >
      <div className="card h-full flex flex-col">
        {/* Image/Gradient Header */}
        <div className={`relative h-48 rounded-lg mb-6 overflow-hidden ${!primaryImage?.url ? `bg-gradient-to-br ${color}` : ''}`}>
          {primaryImage?.url ? (
            <img 
              src={primaryImage.url} 
              alt={primaryImage.alt || project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${color}`}>
              <Layers className="text-white/20" size={64} />
            </div>
          )}
          
          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/20 
                           backdrop-blur-sm text-white text-xs font-medium">
              Featured
            </div>
          )}

          {/* Hover overlay with links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-dark/80 flex items-center justify-center gap-4"
          >
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center
                          text-white hover:bg-white/20 transition-colors"
              >
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center
                          text-white hover:bg-white/20 transition-colors"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-heading text-xl font-semibold text-white mb-3 
                        group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 flex-1">
            {project.shortDescription || project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(project.technologies || []).slice(0, 4).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
            {(project.technologies || []).length > 4 && (
              <span className="px-2 py-1 text-xs rounded-full bg-white/5 text-gray-500">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Projects Grid Section
const ProjectsGridSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [activeCategory, setActiveCategory] = useState('all')
  
  // Fetch projects from API
  const { projects, loading } = useProjects('portfolio')

  const filteredProjects = activeCategory === 'all' 
    ? (projects || [])
    : (projects || []).filter(p => p.category === activeCategory)

  // Get available categories from projects
  const availableCategories = projects?.length > 0 
    ? ['all', ...new Set(projects.map(p => p.category))]
    : ['all']
  const displayCategories = categories.filter(c => availableCategories.includes(c.key))

  if (loading) {
    return (
      <section className="py-20">
        <div className="container-custom flex justify-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  // Empty state when no projects
  if (!projects || projects.length === 0) {
    return (
      <section ref={ref} className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Layers className="text-primary" size={48} />
            </div>
            <h3 className="text-2xl font-heading font-semibold text-white mb-4">
              Projects Coming Soon
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Projects are not yet available or the section is currently under maintenance. 
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
        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {displayCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                         transition-all duration-300 ${
                activeCategory === category.key
                  ? 'bg-primary text-dark'
                  : 'bg-dark-light/50 text-gray-400 hover:text-white hover:bg-dark-light'
              }`}
            >
              <category.icon size={16} />
              <span>{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project._id || project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Layers className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No projects in this category yet.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// Stats Section
const StatsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  const stats = [
    { value: '20+', label: 'Projects Completed' },
    { value: '15+', label: 'Happy Clients' },
    { value: '5+', label: 'Open Source' },
    { value: '4', label: 'Hackathon Finals/Wins' },
  ]

  return (
    <section ref={ref} className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent" />
      
      <div className="container-custom relative">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2"
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Main Projects Component
const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection />
      <ProjectsGridSection />
      <StatsSection />
    </motion.div>
  )
}

export default Projects
