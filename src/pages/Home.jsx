import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ArrowRight, ChevronDown, Download, Mail,
  Code2, Cpu, Bot, Cog, Cloud, Layers,
  Github, Linkedin, ExternalLink, Smartphone
} from 'lucide-react'
import SkillsRadar from '../components/SkillsRadar'
import CodeTag, { SectionTag } from '../components/CodeTag'
import photoBen from '../assets/photo-ben.png'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Hero Section
const HeroSection = () => {
  const [typedText, setTypedText] = useState('')
  const titles = ['Full Stack Engineer', 'AI/ML Developer', 'Robotics Engineer', 'IoT Specialist']
  const [titleIndex, setTitleIndex] = useState(0)
  
  useEffect(() => {
    const currentTitle = titles[titleIndex]
    let charIndex = 0
    let isDeleting = false
    
    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        if (charIndex <= currentTitle.length) {
          setTypedText(currentTitle.slice(0, charIndex))
          charIndex++
        } else {
          setTimeout(() => {
            isDeleting = true
          }, 2000)
        }
      } else {
        if (charIndex > 0) {
          charIndex--
          setTypedText(currentTitle.slice(0, charIndex))
        } else {
          isDeleting = false
          setTitleIndex((prev) => (prev + 1) % titles.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearInterval(typeInterval)
  }, [titleIndex])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient backgrounds */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
          x: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]"
      />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center lg:text-left"
          >
            {/* Greeting */}
            <motion.div 
              variants={fadeInUp}
              className="mb-4"
            >
              <CodeTag language="python" size="sm">
                Hello World
              </CodeTag>
            </motion.div>

            {/* Name */}
            <motion.h1 
              variants={fadeInUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
            >
              <span className="text-white">I'm </span>
              <span className="text-gradient">Parfait Tedom Tedom</span>
            </motion.h1>

            {/* Dynamic title */}
            <motion.div 
              variants={fadeInUp}
              className="h-16 mb-6"
            >
              <h2 className="font-heading text-2xl md:text-3xl text-gray-300">
                <span className="text-primary">{typedText}</span>
                <span className="animate-blink border-r-2 border-primary ml-1">&nbsp;</span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-gray-400 max-w-xl mb-8 leading-relaxed"
            >
              Mechatronics Engineer passionate about building intelligent systems 
              that bridge the gap between software, hardware, and AI. Based in Edmonton, Alberta, Canada.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link to="/contact" className="btn-primary group">
                <span className="flex items-center">
                  Let's Connect
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </span>
              </Link>
              <a 
                href="/resume.pdf" 
                download
                className="btn-outline"
              >
                <span className="flex items-center">
                  <Download size={18} className="mr-2" />
                  Download CV
                </span>
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              variants={fadeInUp}
              className="flex items-center gap-4 mt-8 justify-center lg:justify-start"
            >
              <a 
                href="https://github.com/parfaittedomtedom" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center
                           text-gray-400 hover:text-primary hover:border-primary/50 transition-all duration-300"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://linkedin.com/in/parfaittedomtedom" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center
                           text-gray-400 hover:text-primary hover:border-primary/50 transition-all duration-300"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="mailto:contact@daemoncraft.ca"
                className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center
                           text-gray-400 hover:text-primary hover:border-primary/50 transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </motion.div>
          </motion.div>

          {/* Photo/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            {/* Decorative rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="w-80 h-80 border border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute w-96 h-96 border border-secondary/10 rounded-full border-dashed"
              />
            </div>

            {/* Photo container */}
            <div className="relative z-10">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden 
                              border-4 border-primary/30 shadow-glow-lg">
                <img 
                  src={photoBen} 
                  alt="Parfait Tedom Tedom" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating badges - 4 corners */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg glass
                           flex items-center space-x-2"
              >
                <Bot className="text-primary" size={16} />
                <span className="text-xs text-white font-medium">AI/ML</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -top-4 -left-4 px-3 py-1.5 rounded-lg glass
                           flex items-center space-x-2"
              >
                <Smartphone className="text-green-400" size={16} />
                <span className="text-xs text-white font-medium">Web/Mobile</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-lg glass
                           flex items-center space-x-2"
              >
                <Cog className="text-secondary" size={16} />
                <span className="text-xs text-white font-medium">Robotics</span>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.2, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 px-3 py-1.5 rounded-lg glass
                           flex items-center space-x-2"
              >
                <Cloud className="text-cyan-400" size={16} />
                <span className="text-xs text-white font-medium">Cloud</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-500"
          >
            <span className="text-xs uppercase tracking-wider mb-2">Scroll</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Skills Preview Section
const SkillsPreview = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const skills = {
    frontend: 85,
    backend: 90,
    ai: 88,
    iot: 82,
    robotics: 75,
    cad: 70,
    cloud: 85,
    embedded: 78,
  }

  return (
    <section ref={ref} className="py-32 relative">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Text */}
          <div>
            <motion.div variants={fadeInUp} className="mb-4">
              <SectionTag>Technical Expertise</SectionTag>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title mb-6">
              Full Stack <span className="text-gradient">Engineer</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mb-8">
              A unique blend of software engineering, AI/ML expertise, and hardware 
              knowledge. From web apps to autonomous robots, I bring ideas to life.
            </motion.p>

            <motion.div variants={fadeInUp} className="space-y-4 mb-8">
              {[
                { icon: Code2, text: 'Full-Stack Web & Mobile Development' },
                { icon: Bot, text: 'AI Agents & Machine Learning Models' },
                { icon: Cpu, text: 'IoT Systems & Embedded Solutions' },
                { icon: Cog, text: 'Robotics & Mechatronic Design' },
                { icon: Cloud, text: 'Cloud Architecture & DevOps' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={fadeInUp}
                  className="flex items-center space-x-3 text-gray-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="text-primary" size={16} />
                  </div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link to="/skills" className="btn-outline inline-flex items-center">
                <span>View All Skills</span>
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </motion.div>
          </div>

          {/* Radar Chart */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-center"
          >
            <SkillsRadar skills={skills} size={400} animated={inView} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Featured Projects Section
const FeaturedProjects = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const projects = [
    {
      title: 'AI Immigration Assistant',
      description: 'AI-powered chatbot helping immigrants navigate Canadian settlement processes.',
      tags: ['AI', 'LLM', 'React Native', 'FastAPI'],
      image: '/projects/settledin.jpg',
      link: '/projects/settledin',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'AR Indoor Navigation',
      description: 'Augmented reality navigation system for airports and hospitals.',
      tags: ['AR', 'Unity', 'Computer Vision', 'IoT'],
      image: '/projects/ar-nav.jpg',
      link: '/projects/ar-navigation',
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Autonomous Robot Platform',
      description: 'ROS-based mobile robot with SLAM and autonomous navigation.',
      tags: ['ROS', 'Python', 'SLAM', 'Robotics'],
      image: '/projects/robot.jpg',
      link: '/projects/robot-platform',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <section ref={ref} className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent" />
      
      <div className="container-custom relative">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <SectionTag>Portfolio</SectionTag>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="section-title mb-6">
            Featured <span className="text-gradient">Projects</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            A selection of recent work showcasing my expertise across different domains.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="card-glow group cursor-pointer"
            >
              <Link to={project.link}>
                <div className="card h-full">
                  {/* Image placeholder */}
                  <div className={`h-48 rounded-lg mb-6 bg-gradient-to-br ${project.color} 
                                  flex items-center justify-center overflow-hidden`}>
                    <Layers className="text-white/30" size={64} />
                  </div>
                  
                  <h3 className="font-heading text-xl font-semibold text-white mb-3 
                                group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/projects" className="btn-outline inline-flex items-center">
            <span>View All Projects</span>
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />
        <div className="absolute inset-0 grid-bg opacity-50" />
      </div>

      <div className="container-custom text-center relative z-10">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          <motion.h2 
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Let's Build Something</span>
            <br />
            <span className="text-gradient">Amazing Together</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Whether it's an AI project, a web application, or a robotics challenge, 
            I'm ready to bring your vision to life.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary text-lg px-10 py-4">
              <span className="flex items-center">
                Start a Conversation
                <ArrowRight className="ml-3" size={20} />
              </span>
            </Link>
            <a 
              href="https://daemoncraft.ca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <span className="flex items-center">
                Visit Daemon Craft
                <ExternalLink className="ml-2" size={18} />
              </span>
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
      />
    </section>
  )
}

// Main Home Component
const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection />
      <SkillsPreview />
      <FeaturedProjects />
      <CTASection />
    </motion.div>
  )
}

export default Home
