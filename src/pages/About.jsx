import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  MapPin, Calendar, Award, BookOpen,
  Rocket, Heart, Code2, Cpu, Target, Users,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { usePageMeta } from '../hooks/usePageMeta'
import { FULL_NAME, COMPANY_NAME, COMPANY_URL } from '../data/profile'
import photoBen from '../assets/photo-ben.webp'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const quickFacts = [
  { icon: MapPin, label: 'Location', value: 'Edmonton, AB' },
  { icon: Calendar, label: 'Experience', value: '6+ Years' },
  { icon: BookOpen, label: 'Education', value: 'Mechatronics Eng.' },
  { icon: Rocket, label: 'Company', value: COMPANY_NAME },
]

// Bio Section
const BioSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="py-12 sm:py-20" aria-label="Biography">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16"
        >
          {/* Photo */}
          <motion.div variants={fadeInUp} className="relative px-3 sm:px-4">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl" aria-hidden="true" />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-dark-light">
                <img
                  src={photoBen}
                  alt={`Portrait of ${FULL_NAME}`}
                  width="600"
                  height="800"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover object-top"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark via-dark/80 to-transparent p-5 pt-12 sm:p-6 sm:pt-16">
                  <p className="mb-1 font-display text-xl font-bold text-white sm:text-2xl">{FULL_NAME}</p>
                  <p className="font-mono text-sm text-primary">Full Stack Engineer</p>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="glass absolute -right-3 -top-4 rounded-lg px-4 py-2 sm:-right-4"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary" size={16} aria-hidden="true" />
                  <span className="text-sm text-white">Edmonton, CA</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="glass absolute -bottom-4 -left-3 rounded-lg px-4 py-2 sm:-left-4"
              >
                <div className="flex items-center gap-2">
                  <Award className="text-secondary-light" size={16} aria-hidden="true" />
                  <span className="text-sm text-white">6+ Years Exp</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bio Text */}
          <div>
            <motion.div variants={fadeInUp} className="max-w-prose space-y-6 text-gray-300">
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-primary">Hello!</span> I&apos;m {FULL_NAME},
                a Mechatronics Engineer with a passion for building intelligent systems that
                make a real impact on people&apos;s lives.
              </p>

              <p className="leading-relaxed">
                My journey in tech started in Cameroon where I obtained my engineering degree
                in Mechatronics. The fusion of mechanics, electronics, and computer science
                fascinated me from the start. I&apos;ve always been drawn to projects that combine
                hardware and software to create something truly innovative.
              </p>

              <p className="leading-relaxed">
                Now based in Edmonton, Alberta, Canada, I work at the intersection of
                <span className="text-primary"> AI</span>,
                <span className="text-secondary-light"> full-stack development</span>, and
                <span className="text-accent-light"> robotics</span>.
                Whether it&apos;s building AI agents that help immigrants navigate their new home,
                designing IoT systems, or developing mobile applications, I bring the same
                level of passion and attention to detail.
              </p>

              <p className="leading-relaxed">
                Through my company{' '}
                <a
                  href={COMPANY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {COMPANY_NAME}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                , I help businesses leverage cutting-edge technology to solve real-world problems.
              </p>
            </motion.div>

            {/* Quick facts */}
            <motion.dl variants={fadeInUp} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="rounded-lg border border-white/5 bg-dark-light/50 p-4">
                  <fact.icon className="mb-2 text-primary" size={20} aria-hidden="true" />
                  <dt className="text-xs uppercase tracking-wider text-gray-400">{fact.label}</dt>
                  <dd className="font-medium text-white">{fact.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const values = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'I believe in writing maintainable, well-documented code that stands the test of time.',
  },
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'Every project is an opportunity to deliver real value and exceed expectations.',
  },
  {
    icon: Users,
    title: 'User-Centered',
    description: 'Technology should serve people. I design with the end user always in mind.',
  },
  {
    icon: Cpu,
    title: 'Innovation',
    description: 'Constantly exploring new technologies to find better solutions to complex problems.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'I genuinely love what I do, and it shows in every line of code I write.',
  },
  {
    icon: Rocket,
    title: 'Growth Mindset',
    description: 'Always learning, always improving. The tech world never stops, and neither do I.',
  },
]

// Values Section
const ValuesSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="relative py-20 sm:py-28" aria-labelledby="values-title">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent" aria-hidden="true" />

      <div className="container-custom relative">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="mb-12 text-center sm:mb-16"
        >
          <motion.p variants={fadeInUp} className="section-tag mb-4">
            Core Values
          </motion.p>
          <motion.h2 id="values-title" variants={fadeInUp} className="section-title mb-6">
            What Drives <span className="text-gradient">My Work</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mx-auto">
            The principles that guide every project and interaction.
          </motion.p>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {values.map((value) => (
            <motion.li key={value.title} variants={fadeInUp} whileHover={{ y: -5 }} className="card group">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20
                           to-secondary/20 transition-transform group-hover:scale-110"
                aria-hidden="true"
              >
                <value.icon className="text-primary" size={24} />
              </div>
              <h3 className="mb-2 font-heading text-xl font-semibold text-white">{value.title}</h3>
              <p className="text-sm text-gray-300">{value.description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

const milestones = [
  {
    year: '2019',
    title: 'Engineering Degree',
    description: 'Graduated with a Mechatronics Engineering degree from Cameroon.',
    color: 'bg-blue-500',
  },
  {
    year: '2020',
    title: 'Started Professional Career',
    description: 'Began working as a full-stack developer, building web and mobile applications.',
    color: 'bg-green-500',
  },
  {
    year: '2024',
    title: 'Moved to Canada',
    description: 'Relocated to Edmonton to pursue new opportunities and challenges.',
    color: 'bg-purple-500',
  },
  {
    year: '2025',
    title: 'Founded Daemon Craft',
    description: 'Launched my own company focused on AI, IoT, and intelligent solutions.',
    color: 'bg-orange-500',
  },
  {
    year: '2025',
    title: 'Growing & Building',
    description: 'Continuing to build innovative solutions and help businesses succeed.',
    color: 'bg-cyan-500',
  },
]

// Journey Timeline
const JourneySection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section ref={ref} className="py-20 sm:py-28" aria-labelledby="journey-title">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="mb-12 text-center sm:mb-16"
        >
          <motion.p variants={fadeInUp} className="section-tag mb-4">
            My Journey
          </motion.p>
          <motion.h2 id="journey-title" variants={fadeInUp} className="section-title mb-6">
            Career <span className="text-gradient">Milestones</span>
          </motion.h2>
        </motion.div>

        <motion.ol
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={stagger}
          className="relative mx-auto max-w-3xl"
        >
          {/* Timeline line */}
          <div
            className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-primary via-secondary to-accent sm:left-8"
            aria-hidden="true"
          />

          {milestones.map((milestone) => (
            <motion.li key={milestone.title} variants={fadeInUp} className="relative pb-8 pl-12 last:pb-0 sm:pb-12 sm:pl-20">
              {/* Dot, centred on the line */}
              <span
                className={`absolute left-4 top-7 h-4 w-4 -translate-x-1/2 rounded-full sm:left-8 ${milestone.color} shadow-lg`}
                aria-hidden="true"
              />

              <div className="card">
                <span className="font-mono text-sm text-primary">{milestone.year}</span>
                <h3 className="mb-2 mt-1 font-heading text-lg font-semibold text-white sm:text-xl">{milestone.title}</h3>
                <p className="text-sm text-gray-300">{milestone.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}

// Main About Component
const About = () => {
  usePageMeta({
    title: 'About',
    description: `${FULL_NAME} — Mechatronics Engineer based in Edmonton, Canada, building intelligent systems across AI, full-stack development and robotics.`,
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHero
        tag="About Me"
        title="The Story"
        highlight="Behind The Code"
        subtitle="From Cameroon to Canada, a journey driven by passion for technology and the dream of building intelligent systems."
      />
      <BioSection />
      <ValuesSection />
      <JourneySection />
    </motion.div>
  )
}

export default About
