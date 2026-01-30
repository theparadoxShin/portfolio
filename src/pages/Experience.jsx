import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Briefcase, Calendar, MapPin, ExternalLink,
  ChevronRight, Building2
} from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Experience data
const experiences = [
  {
    id: 1,
    title: 'Founder & Lead Engineer',
    company: 'Daemon Craft Inc.',
    location: 'Montreal, QC',
    type: 'Full-time',
    startDate: '2023-09',
    endDate: null,
    current: true,
    description: 'Founded and lead a technology company specializing in AI agents, IoT solutions, and intelligent software systems.',
    achievements: [
      'Developed AI-powered immigration assistance platform serving 500+ users',
      'Built AR indoor navigation system for enterprise clients',
      'Won multiple hackathons with innovative AI solutions',
      'Established partnerships with technology providers'
    ],
    technologies: ['Python', 'React Native', 'AWS', 'OpenAI', 'FastAPI', 'IoT'],
    color: '#00D9FF'
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'Tech Solutions Co.',
    location: 'Montreal, QC',
    type: 'Contract',
    startDate: '2022-06',
    endDate: '2023-08',
    current: false,
    description: 'Developed web and mobile applications for various clients, focusing on scalable architecture and user experience.',
    achievements: [
      'Built e-commerce platform handling 10K+ daily transactions',
      'Implemented CI/CD pipelines reducing deployment time by 60%',
      'Led migration of legacy systems to cloud infrastructure',
      'Mentored junior developers on best practices'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    color: '#8B5CF6'
  },
  {
    id: 3,
    title: 'Software Engineer',
    company: 'StartupXYZ',
    location: 'Cameroon (Remote)',
    type: 'Full-time',
    startDate: '2020-03',
    endDate: '2022-05',
    current: false,
    description: 'Joined early-stage startup building IoT solutions for agriculture sector in Africa.',
    achievements: [
      'Designed IoT architecture for smart farming system',
      'Developed mobile app with 5K+ downloads',
      'Integrated sensor networks for real-time monitoring',
      'Reduced hardware costs by 40% through optimization'
    ],
    technologies: ['React Native', 'ESP32', 'MQTT', 'Firebase', 'Python'],
    color: '#10B981'
  },
  {
    id: 4,
    title: 'Mechatronics Engineer',
    company: 'Engineering Solutions Ltd.',
    location: 'Cameroon',
    type: 'Full-time',
    startDate: '2018-09',
    endDate: '2020-02',
    current: false,
    description: 'Applied mechatronics engineering skills to industrial automation and robotics projects.',
    achievements: [
      'Designed automated production line components',
      'Programmed PLC systems for manufacturing',
      'Developed predictive maintenance algorithms',
      'Created technical documentation and training materials'
    ],
    technologies: ['PLC', 'MATLAB', 'SolidWorks', 'C++', 'AutoCAD'],
    color: '#F59E0B'
  }
]

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'Present'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// Calculate duration
const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (years > 0 && remainingMonths > 0) {
    return `${years}y ${remainingMonths}m`
  } else if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`
  } else {
    return `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`
  }
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
            Career Journey
          </motion.p>
          <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Professional</span>{' '}
            <span className="text-gradient">Experience</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-400 max-w-3xl mx-auto">
            From mechatronics engineering to full-stack development and AI - 
            a journey of continuous growth and innovation.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// Experience Card
const ExperienceCard = ({ experience, index }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline connector */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b hidden lg:block"
        style={{ 
          background: `linear-gradient(180deg, ${experience.color}40 0%, transparent 100%)`,
          left: '-1px'
        }}
      />

      {/* Timeline dot */}
      <div 
        className="absolute -left-2 top-0 w-4 h-4 rounded-full hidden lg:block"
        style={{ backgroundColor: experience.color }}
      >
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: experience.color }}
        />
      </div>

      {/* Content card */}
      <div className="card ml-0 lg:ml-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {experience.current && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400 font-medium">
                  Current
                </span>
              )}
              <span className="text-gray-500 text-sm">{experience.type}</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-white mb-1">
              {experience.title}
            </h3>
            <div className="flex items-center text-primary font-medium">
              <Building2 size={16} className="mr-2" />
              {experience.company}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-gray-400 text-sm mb-1">
              <Calendar size={14} className="mr-2" />
              {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin size={14} className="mr-2" />
              {experience.location}
            </div>
            <div className="text-primary text-sm mt-1 font-mono">
              {calculateDuration(experience.startDate, experience.endDate)}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 mb-6">
          {experience.description}
        </p>

        {/* Achievements */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <ChevronRight className="text-primary mr-1" size={16} />
            Key Achievements
          </h4>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start text-gray-400 text-sm">
                <span 
                  className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                  style={{ backgroundColor: experience.color }}
                />
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-300 
                        border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Timeline Section
const TimelineSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="py-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto relative">
          {/* Main timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden lg:block" />

          {/* Experience cards */}
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Summary Stats
const SummarySection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  const totalYears = experiences.reduce((acc, exp) => {
    const start = new Date(exp.startDate)
    const end = exp.endDate ? new Date(exp.endDate) : new Date()
    return acc + (end - start) / (1000 * 60 * 60 * 24 * 365)
  }, 0)

  const stats = [
    { value: `${Math.round(totalYears)}+`, label: 'Years Experience' },
    { value: `${experiences.length}`, label: 'Companies' },
    { value: '15+', label: 'Projects Delivered' },
    { value: '3', label: 'Countries' },
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

// Main Experience Component
const Experience = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection />
      <TimelineSection />
      <SummarySection />
    </motion.div>
  )
}

export default Experience
