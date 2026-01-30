import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Github, Linkedin, Twitter, Mail, MapPin, 
  Terminal, ArrowUpRight, Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'About', path: '/about' },
    { label: 'Skills', path: '/skills' },
    { label: 'Projects', path: '/projects' },
    { label: 'Experience', path: '/experience' },
    { label: 'Certifications', path: '/certifications' },
    { label: 'Contact', path: '/contact' },
  ]

  const socialLinks = [
    { icon: Github, href: 'https://github.com/parfaittedomtedom', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/parfaittedomtedom', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/parfaittedom', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@daemoncraft.ca', label: 'Email' },
  ]

  const expertise = [
    'AI & Machine Learning',
    'Full-Stack Development',
    'IoT & Embedded Systems',
    'Robotics & Mechatronics',
    'Cloud Architecture',
    'CAD Design',
  ]

  return (
    <footer className="relative mt-20 border-t border-white/5">
      {/* Gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Main footer content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary 
                           flex items-center justify-center shadow-glow"
              >
                <Terminal className="text-dark" size={20} />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-white text-lg">Ben Parfait</span>
                <span className="text-xs text-primary font-mono">Full Stack Robotics Engineer</span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Crafting intelligent solutions at the intersection of software, 
              hardware, and artificial intelligence. From Montreal 🇨🇦
            </p>

            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={14} className="mr-2 text-primary" />
              <span>Montreal, Quebec, Canada</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary transition-colors duration-300
                               flex items-center group text-sm"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Expertise</h4>
            <ul className="space-y-3">
              {expertise.map((item) => (
                <li key={item} className="text-gray-400 text-sm flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Connect</h4>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg border border-white/10 
                             flex items-center justify-center
                             text-gray-400 hover:text-primary hover:border-primary/50
                             hover:bg-primary/5 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>

            {/* CTA */}
            <a
              href="mailto:contact@daemoncraft.ca"
              className="inline-flex items-center text-sm text-primary hover:text-primary-light
                         transition-colors duration-300 group"
            >
              <span>contact@daemoncraft.ca</span>
              <ArrowUpRight 
                size={14} 
                className="ml-1 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Ben Parfait. All rights reserved.
            </p>
            
            <p className="text-gray-500 text-sm flex items-center">
              Built with <Heart size={14} className="mx-1 text-red-500" /> using React & Tailwind
            </p>

            <div className="flex items-center space-x-4">
              <a 
                href="https://daemoncraft.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Daemon Craft Inc.
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-[80px]" />
    </footer>
  )
}

export default Footer
