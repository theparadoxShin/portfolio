import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  MapPin, Calendar, Award, BookOpen, 
  Rocket, Heart, Code2, Cpu, Target, Users
} from 'lucide-react'
import photoBen from '../assets/photo-ben.png'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
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
            About Me
          </motion.p>
          <motion.h1 variants={fadeInUp} className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">The Story</span>{' '}
            <span className="text-gradient">Behind The Code</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-400 max-w-3xl mx-auto">
            From Cameroon to Canada, a journey driven by passion for technology 
            and the dream of building intelligent systems.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// Bio Section
const BioSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="py-20">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Photo */}
          <motion.div variants={fadeInUp} className="relative">
            <div className="relative max-w-md mx-auto">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
              
              {/* Image container */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={photoBen} 
                  alt="Ben Parfait" 
                  className="w-full aspect-[4/5] object-cover"
                />
                
                {/* Overlay info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark to-transparent">
                  <h3 className="font-display text-2xl font-bold text-white mb-1">
                    Ben Parfait Tedom Tedom
                  </h3>
                  <p className="text-primary font-mono text-sm">
                    Full Stack Robotics Engineer
                  </p>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-lg glass"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="text-primary" size={16} />
                  <span className="text-sm text-white">Montreal, CA</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg glass"
              >
                <div className="flex items-center space-x-2">
                  <Award className="text-secondary" size={16} />
                  <span className="text-sm text-white">5+ Years Exp</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bio Text */}
          <div>
            <motion.div variants={fadeInUp} className="space-y-6 text-gray-300">
              <p className="text-lg leading-relaxed">
                <span className="text-primary font-semibold">Hello!</span> I'm Ben Parfait, 
                a Mechatronics Engineer with a passion for building intelligent systems that 
                make a real impact on people's lives.
              </p>
              
              <p className="leading-relaxed">
                My journey in tech started in Cameroon where I obtained my engineering degree 
                in Mechatronics. The fusion of mechanics, electronics, and computer science 
                fascinated me from the start. I've always been drawn to projects that combine 
                hardware and software to create something truly innovative.
              </p>

              <p className="leading-relaxed">
                Now based in Montreal, Canada, I work at the intersection of 
                <span className="text-primary"> AI</span>, 
                <span className="text-secondary"> robotics</span>, and 
                <span className="text-accent"> full-stack development</span>. 
                Whether it's building AI agents that help immigrants navigate their new home, 
                designing IoT systems, or developing mobile applications, I bring the same 
                level of passion and attention to detail.
              </p>

              <p className="leading-relaxed">
                Through my company <span className="text-primary font-semibold">Daemon Craft Inc.</span>, 
                I help businesses leverage cutting-edge technology to solve real-world problems.
              </p>
            </motion.div>

            {/* Quick facts */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 gap-4 mt-8"
            >
              {[
                { icon: MapPin, label: 'Location', value: 'Montreal, QC' },
                { icon: Calendar, label: 'Experience', value: '5+ Years' },
                { icon: BookOpen, label: 'Education', value: 'Mechatronics Eng.' },
                { icon: Rocket, label: 'Company', value: 'Daemon Craft Inc.' },
              ].map((fact, i) => (
                <div key={i} className="p-4 rounded-lg bg-dark-light/50 border border-white/5">
                  <fact.icon className="text-primary mb-2" size={20} />
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{fact.label}</p>
                  <p className="text-white font-medium">{fact.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Values Section
const ValuesSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const values = [
    {
      icon: Code2,
      title: 'Clean Code',
      description: 'I believe in writing maintainable, well-documented code that stands the test of time.'
    },
    {
      icon: Target,
      title: 'Results-Driven',
      description: 'Every project is an opportunity to deliver real value and exceed expectations.'
    },
    {
      icon: Users,
      title: 'User-Centered',
      description: 'Technology should serve people. I design with the end user always in mind.'
    },
    {
      icon: Cpu,
      title: 'Innovation',
      description: 'Constantly exploring new technologies to find better solutions to complex problems.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'I genuinely love what I do, and it shows in every line of code I write.'
    },
    {
      icon: Rocket,
      title: 'Growth Mindset',
      description: 'Always learning, always improving. The tech world never stops, and neither do I.'
    },
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
          <motion.p variants={fadeInUp} className="section-tag mb-4">
            Core Values
          </motion.p>
          <motion.h2 variants={fadeInUp} className="section-title mb-6">
            What Drives <span className="text-gradient">My Work</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            The principles that guide every project and interaction.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="card group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 
                             flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <value.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-2">
                {value.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Journey Timeline
const JourneySection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const milestones = [
    {
      year: '2018',
      title: 'Engineering Degree',
      description: 'Graduated with a Mechatronics Engineering degree from Cameroon.',
      color: 'bg-blue-500'
    },
    {
      year: '2020',
      title: 'Started Professional Career',
      description: 'Began working as a full-stack developer, building web and mobile applications.',
      color: 'bg-green-500'
    },
    {
      year: '2022',
      title: 'Moved to Canada',
      description: 'Relocated to Montreal to pursue new opportunities and challenges.',
      color: 'bg-purple-500'
    },
    {
      year: '2023',
      title: 'Founded Daemon Craft',
      description: 'Launched my own company focused on AI, IoT, and intelligent solutions.',
      color: 'bg-orange-500'
    },
    {
      year: '2024',
      title: 'AI/ML Certifications',
      description: 'Obtained AWS and DeepLearning.AI certifications to expand expertise.',
      color: 'bg-pink-500'
    },
    {
      year: '2025',
      title: 'Growing & Building',
      description: 'Continuing to build innovative solutions and help businesses succeed.',
      color: 'bg-cyan-500'
    },
  ]

  return (
    <section ref={ref} className="py-32">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeInUp} className="section-tag mb-4">
            My Journey
          </motion.p>
          <motion.h2 variants={fadeInUp} className="section-title mb-6">
            Career <span className="text-gradient">Milestones</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="relative max-w-3xl mx-auto"
        >
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent" />

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              variants={fadeInUp}
              className="relative pl-20 pb-12 last:pb-0"
            >
              {/* Dot */}
              <div className={`absolute left-6 w-4 h-4 rounded-full ${milestone.color} 
                             transform -translate-x-1/2 shadow-lg`}>
                <div className={`absolute inset-0 rounded-full ${milestone.color} animate-ping opacity-20`} />
              </div>

              {/* Content */}
              <div className="card">
                <span className="text-primary font-mono text-sm">{milestone.year}</span>
                <h3 className="font-heading text-xl font-semibold text-white mt-1 mb-2">
                  {milestone.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Main About Component
const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroSection />
      <BioSection />
      <ValuesSection />
      <JourneySection />
    </motion.div>
  )
}

export default About
