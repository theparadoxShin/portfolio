import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ExternalLink, Github, Layers, Filter,
  Bot, Smartphone, Cpu, Cog, Globe, Code2
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Project data
const projects = [
  {
    id: 1,
    title: 'SettleIn Canada',
    description: 'AI-powered mobile app helping immigrants navigate Canadian settlement with CV generation, budget tracking, and service discovery.',
    longDescription: 'A comprehensive React Native application that combines AI assistance with practical tools for newcomers to Canada. Features include intelligent document analysis, multi-language support, and integration with local services.',
    category: 'ai-agent',
    tags: ['React Native', 'FastAPI', 'OpenAI', 'PostgreSQL', 'GCP'],
    image: null,
    color: 'from-blue-500 to-purple-600',
    github: 'https://github.com/parfaittedomtedom/settledin',
    demo: null,
    featured: true
  },
  {
    id: 2,
    title: 'AR Indoor Navigation',
    description: 'Augmented reality navigation system for complex indoor environments like airports, hospitals, and shopping centers.',
    longDescription: 'B2B SaaS solution using ARKit/ARCore and computer vision for precise indoor positioning. Includes admin dashboard for venue management and real-time analytics.',
    category: 'iot',
    tags: ['Unity', 'ARKit', 'ARCore', 'Node.js', 'AWS'],
    image: null,
    color: 'from-green-500 to-teal-600',
    github: null,
    demo: 'https://ar-nav-demo.daemoncraft.ca',
    featured: true
  },
  {
    id: 3,
    title: 'ImmiShield Agent',
    description: 'Financial document compliance analyzer for Canadian immigration using AI-powered document extraction.',
    longDescription: 'Hackathon-winning project using LandingAI and AWS Bedrock for intelligent document processing. Analyzes bank statements, tax returns, and other financial documents for immigration compliance.',
    category: 'ai-agent',
    tags: ['Python', 'AWS Bedrock', 'LandingAI', 'FastAPI'],
    image: null,
    color: 'from-orange-500 to-red-600',
    github: 'https://github.com/parfaittedomtedom/immishield',
    demo: null,
    featured: true
  },
  {
    id: 4,
    title: 'Autonomous Robot Platform',
    description: 'ROS-based mobile robot with SLAM capabilities and autonomous navigation for research applications.',
    longDescription: 'Custom-built mobile robot platform using ROS2, featuring LiDAR-based SLAM, path planning, and obstacle avoidance. Designed for indoor mapping and navigation research.',
    category: 'robotics',
    tags: ['ROS2', 'Python', 'SLAM', 'LiDAR', 'Raspberry Pi'],
    image: null,
    color: 'from-red-500 to-orange-600',
    github: 'https://github.com/parfaittedomtedom/ros-robot',
    demo: null,
    featured: false
  },
  {
    id: 5,
    title: 'Smart Agriculture IoT',
    description: 'IoT system for precision agriculture with soil monitoring, automated irrigation, and crop health analytics.',
    longDescription: 'Complete IoT solution using ESP32 sensors, MQTT messaging, and cloud analytics. Dashboard provides real-time monitoring and AI-powered recommendations for optimal crop yield.',
    category: 'iot',
    tags: ['ESP32', 'MQTT', 'Node.js', 'React', 'AWS IoT'],
    image: null,
    color: 'from-green-600 to-emerald-500',
    github: 'https://github.com/parfaittedomtedom/smart-agri',
    demo: null,
    featured: false
  },
  {
    id: 6,
    title: 'AI Chatbot Framework',
    description: 'Customizable chatbot framework with multi-LLM support, RAG capabilities, and enterprise integrations.',
    longDescription: 'Open-source chatbot framework supporting OpenAI, Claude, and local LLMs. Features include document ingestion, conversation memory, and webhook integrations.',
    category: 'chatbot',
    tags: ['Python', 'LangChain', 'FastAPI', 'ChromaDB', 'React'],
    image: null,
    color: 'from-purple-500 to-pink-600',
    github: 'https://github.com/parfaittedomtedom/chatbot-framework',
    demo: null,
    featured: false
  },
  {
    id: 7,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with inventory management, payment processing, and analytics dashboard.',
    longDescription: 'Complete e-commerce platform built with Next.js and Node.js. Features include Stripe integration, inventory management, order tracking, and comprehensive admin dashboard.',
    category: 'web',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Tailwind'],
    image: null,
    color: 'from-cyan-500 to-blue-600',
    github: null,
    demo: 'https://ecommerce-demo.daemoncraft.ca',
    featured: false
  },
  {
    id: 8,
    title: 'Fitness Tracker App',
    description: 'Cross-platform mobile app for workout tracking, meal planning, and health analytics.',
    longDescription: 'React Native app with features including workout logging, custom exercise creation, meal tracking with barcode scanning, and progress visualization.',
    category: 'mobile',
    tags: ['React Native', 'Expo', 'Firebase', 'Health APIs'],
    image: null,
    color: 'from-pink-500 to-rose-600',
    github: 'https://github.com/parfaittedomtedom/fitness-app',
    demo: null,
    featured: false
  }
]

// Categories
const categories = [
  { key: 'all', label: 'All Projects', icon: Layers },
  { key: 'ai-agent', label: 'AI Agents', icon: Bot },
  { key: 'chatbot', label: 'Chatbots', icon: Bot },
  { key: 'iot', label: 'IoT', icon: Cpu },
  { key: 'robotics', label: 'Robotics', icon: Cog },
  { key: 'web', label: 'Web', icon: Globe },
  { key: 'mobile', label: 'Mobile', icon: Smartphone },
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
        <div className={`relative h-48 rounded-lg mb-6 bg-gradient-to-br ${project.color} 
                        overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="text-white/20" size={64} />
          </div>
          
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
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center
                          text-white hover:bg-white/20 transition-colors"
              >
                <Github size={20} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
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
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="px-2 py-1 text-xs rounded-full bg-white/5 text-gray-500">
                +{project.tags.length - 4}
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

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory)

  return (
    <section ref={ref} className="py-20">
      <div className="container-custom">
        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
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
              <ProjectCard key={project.id} project={project} index={index} />
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
    { value: '3', label: 'Hackathon Wins' },
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
