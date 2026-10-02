import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Helena from './components/Helena'
import ScrollManager from './components/ScrollManager'
import { PageLoader } from './components/DataState'
import Home from './pages/Home'

// Route-level code splitting: Home ships in the main bundle (most visits land
// there), every other page is loaded on demand.
const pageLoaders = {
  about: () => import('./pages/About'),
  skills: () => import('./pages/Skills'),
  projects: () => import('./pages/Projects'),
  projectDetail: () => import('./pages/ProjectDetail'),
  experience: () => import('./pages/Experience'),
  certifications: () => import('./pages/Certifications'),
  contact: () => import('./pages/Contact'),
  notFound: () => import('./pages/NotFound'),
}

const About = lazy(pageLoaders.about)
const Skills = lazy(pageLoaders.skills)
const Projects = lazy(pageLoaders.projects)
const ProjectDetail = lazy(pageLoaders.projectDetail)
const Experience = lazy(pageLoaders.experience)
const Certifications = lazy(pageLoaders.certifications)
const Contact = lazy(pageLoaders.contact)
const NotFound = lazy(pageLoaders.notFound)

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

const skipToContent = (event) => {
  event.preventDefault()
  const main = document.getElementById('main-content')
  if (main) {
    main.focus({ preventScroll: true })
    main.scrollIntoView({ block: 'start' })
  }
}

function App() {
  // Warm up the other pages once the browser is idle so navigation feels instant.
  useEffect(() => {
    const prefetch = () => Object.values(pageLoaders).forEach((load) => load().catch(() => {}))
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(prefetch, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-dark">
        <a href="#main-content" className="skip-link" onClick={skipToContent}>
          Skip to main content
        </a>

        {/* Decorative background */}
        <div className="grid-bg pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
        <div className="pointer-events-none fixed left-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[120px] sm:h-[500px] sm:w-[500px] sm:blur-[150px]" aria-hidden="true" />
        <div className="pointer-events-none fixed bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-[120px] sm:h-[500px] sm:w-[500px] sm:blur-[150px]" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />

        <ScrollManager />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
            <Suspense fallback={<PageLoader />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
          <Footer />
        </div>

        <Helena />
      </div>
    </MotionConfig>
  )
}

export default App
