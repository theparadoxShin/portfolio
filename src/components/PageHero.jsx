import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

/** Shared hero for inner pages: tag line, one <h1>, optional subtitle. */
const PageHero = ({ tag, title, highlight, subtitle, children }) => (
  <section className="relative overflow-hidden pb-12 pt-28 sm:pb-16 sm:pt-32">
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute inset-0 grid-bg opacity-30" />
    </div>

    <div className="container-custom relative z-10">
      <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center">
        {tag && (
          <motion.p variants={fadeInUp} className="section-tag mb-4">
            {tag}
          </motion.p>
        )}
        <motion.h1
          variants={fadeInUp}
          className="mb-6 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title && <span className="text-white">{title}</span>}
          {title && highlight && ' '}
          {highlight && <span className="text-gradient">{highlight}</span>}
        </motion.h1>
        {subtitle && (
          <motion.p variants={fadeInUp} className="mx-auto max-w-3xl text-pretty text-lg text-gray-300 sm:text-xl">
            {subtitle}
          </motion.p>
        )}
        {children}
      </motion.div>
    </div>
  </section>
)

export default PageHero
