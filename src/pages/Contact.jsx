import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Linkedin, Github, MapPin, Send, Bot, Cloud, Zap, Globe, CheckCircle2, AlertCircle, Loader2, ChevronDown,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { useContact } from '../hooks/useApi'
import { useRecaptcha } from '../hooks/useRecaptcha'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  EMAIL, GITHUB, LINKEDIN, RESUME_URL,
} from '../data/profile'

const EMPTY_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
  company: '',
  phone: '',
  projectType: '',
  budget: '',
  timeline: '',
}

const PROJECT_TYPES = [
  ['ai-agent', 'AI agent'],
  ['chatbot', 'Chatbot'],
  ['iot', 'IoT'],
  ['robotics', 'Robotics'],
  ['web', 'Web application'],
  ['mobile', 'Mobile application'],
  ['consulting', 'Consulting'],
  ['other', 'Other'],
]

const BUDGETS = [
  ['under-5k', 'Under $5k'],
  ['5k-15k', '$5k – $15k'],
  ['15k-50k', '$15k – $50k'],
  ['50k-plus', '$50k+'],
  ['not-sure', 'Not sure yet'],
]

const TIMELINES = [
  ['asap', 'As soon as possible'],
  ['1-month', 'Within a month'],
  ['1-3-months', '1 – 3 months'],
  ['3-6-months', '3 – 6 months'],
  ['flexible', 'Flexible'],
]

const LIMITS = { name: 100, email: 254, subject: 200, message: 5000, company: 150, phone: 40 }
const FIELD_ORDER = ['name', 'email', 'subject', 'message', 'company', 'phone', 'projectType', 'budget', 'timeline']
const OPTIONAL_FIELDS = ['company', 'phone', 'projectType', 'budget', 'timeline']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const validate = (data) => {
  const errors = {}
  const required = { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message' }
  Object.entries(required).forEach(([key, label]) => {
    if (!data[key].trim()) errors[key] = `${label} is required`
  })
  if (!errors.email && !EMAIL_PATTERN.test(data.email.trim())) errors.email = 'Please enter a valid email'
  Object.entries(LIMITS).forEach(([key, max]) => {
    if (!errors[key] && data[key].trim().length > max) errors[key] = `Maximum ${max} characters`
  })
  return errors
}

const contactInfo = [
  { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, color: '#00D9FF' },
  { icon: Linkedin, label: 'LinkedIn', value: LINKEDIN.handle, href: LINKEDIN.url, color: '#38A3E0' },
  { icon: Github, label: 'GitHub', value: GITHUB.handle, href: GITHUB.url, color: '#A78BFA' },
  { icon: MapPin, label: 'Location', value: 'Edmonton, AB, Canada', href: null, color: '#10B981' },
]

const inputBase = `w-full min-h-[48px] rounded-lg border bg-white/5 px-4 py-3 text-base text-white placeholder-gray-500
  transition-colors duration-300 focus:border-primary focus:bg-white/[0.07] focus:shadow-lg focus:shadow-primary/10`

const inputClasses = (hasError) => `${inputBase} ${hasError ? 'border-red-400/70' : 'border-white/15 hover:border-white/25'}`

const Field = ({ id, label, required = false, error, children, hint }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-200">
      {label}
      {required ? (
        <span className="text-primary" aria-hidden="true"> *</span>
      ) : (
        <span className="font-normal text-gray-400"> (optional)</span>
      )}
    </label>
    {children}
    {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-red-300">
        <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
)

const describedBy = (id, error, hint) => [error ? `${id}-error` : null, !error && hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined

const ContactForm = () => {
  const { submitContact, loading, error: serverError, fieldErrors: serverFieldErrors, success, reset } = useContact()
  const { executeRecaptcha, isConfigured: recaptchaConfigured } = useRecaptcha()
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [showDetails, setShowDetails] = useState(false)
  const formRef = useRef(null)
  const alertRef = useRef(null)

  // Server field errors disappear as soon as the visitor edits that field.
  const [editedSinceSubmit, setEditedSinceSubmit] = useState({})
  const visibleServerErrors = Object.fromEntries(
    Object.entries(serverFieldErrors || {}).filter(([field]) => !editedSinceSubmit[field]),
  )
  const allErrors = { ...visibleServerErrors, ...errors }

  // Server-side field errors: open the optional section if needed and focus the first one.
  useEffect(() => {
    const keys = Object.keys(serverFieldErrors || {})
    if (keys.length === 0) {
      if (serverError) alertRef.current?.focus()
      return
    }
    if (keys.some((k) => OPTIONAL_FIELDS.includes(k))) setShowDetails(true)
    const first = FIELD_ORDER.find((k) => serverFieldErrors[k])
    requestAnimationFrame(() => document.getElementById(`contact-${first}`)?.focus())
  }, [serverFieldErrors, serverError])

  // The success block mounts after the form's exit animation: focus it on mount.
  const focusOnMount = useCallback((el) => {
    if (el) el.focus()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    if (serverFieldErrors?.[name]) setEditedSinceSubmit((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    const clientErrors = validate(formData)
    setErrors(clientErrors)
    setEditedSinceSubmit({})
    const first = FIELD_ORDER.find((k) => clientErrors[k])
    if (first) {
      if (OPTIONAL_FIELDS.includes(first)) setShowDetails(true)
      requestAnimationFrame(() => document.getElementById(`contact-${first}`)?.focus())
      return
    }

    // Token may be null (not configured / blocked): the API then answers with a readable message.
    const recaptchaToken = await executeRecaptcha('contact_form')
    const result = await submitContact(formData, recaptchaToken)
    if (result.ok) {
      setFormData(EMPTY_FORM)
      setErrors({})
      setShowDetails(false)
    }
  }

  const handleReset = () => {
    reset()
    requestAnimationFrame(() => document.getElementById('contact-name')?.focus())
  }

  const inputProps = (name, { hint } = {}) => ({
    id: `contact-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
    'aria-invalid': allErrors[name] ? true : undefined,
    'aria-describedby': describedBy(`contact-${name}`, allErrors[name], hint),
    className: inputClasses(Boolean(allErrors[name])),
  })

  const messageLength = formData.message.length

  return (
    <div className="glass-card p-6 sm:p-8">
      <h2 className="mb-6 font-heading text-xl font-bold text-white">Send a Message</h2>

      <AnimatePresence mode="wait" initial={false}>
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-10 text-center"
            role="status"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-12 w-12 text-green-400" aria-hidden="true" />
            </div>
            <h3 ref={focusOnMount} tabIndex={-1} className="mb-2 text-2xl font-bold text-white">Message Sent!</h3>
            <p className="mb-6 text-gray-300">Thank you for reaching out. I&apos;ll get back to you soon.</p>
            <button type="button" onClick={handleReset} className="btn-primary">
              <span>Send Another Message</span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            aria-busy={loading}
            className="space-y-5"
          >
            <p className="text-sm text-gray-400">
              Fields marked <span className="text-primary" aria-hidden="true">*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <Field id="contact-name" label="Name" required error={allErrors.name}>
                <input type="text" autoComplete="name" required maxLength={LIMITS.name} placeholder="Your name" {...inputProps('name')} />
              </Field>
              <Field id="contact-email" label="Email" required error={allErrors.email}>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={LIMITS.email}
                  placeholder="your@email.com"
                  {...inputProps('email')}
                />
              </Field>
            </div>

            <Field id="contact-subject" label="Subject" required error={allErrors.subject}>
              <input type="text" required maxLength={LIMITS.subject} placeholder="What's this about?" {...inputProps('subject')} />
            </Field>

            <Field
              id="contact-message"
              label="Message"
              required
              error={allErrors.message}
              hint={messageLength > LIMITS.message - 500 ? `${LIMITS.message - messageLength} characters left` : undefined}
            >
              <textarea
                rows={6}
                required
                maxLength={LIMITS.message}
                placeholder="Tell me about your project or inquiry..."
                {...inputProps('message', { hint: messageLength > LIMITS.message - 500 })}
                className={`${inputClasses(Boolean(allErrors.message))} resize-y`}
              />
            </Field>

            {/* Optional project details */}
            <div className="rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                aria-expanded={showDetails}
                aria-controls="contact-details"
                className="flex min-h-[48px] w-full items-center justify-between gap-3 rounded-lg px-4 text-left text-sm font-medium text-gray-200 hover:bg-white/5"
              >
                <span>
                  Project details <span className="font-normal text-gray-400">(optional)</span>
                </span>
                <ChevronDown size={18} className={`shrink-0 transition-transform ${showDetails ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              <div id="contact-details" hidden={!showDetails} className="space-y-5 border-t border-white/10 p-4">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field id="contact-company" label="Company" error={allErrors.company}>
                    <input type="text" autoComplete="organization" maxLength={LIMITS.company} {...inputProps('company')} />
                  </Field>
                  <Field id="contact-phone" label="Phone" error={allErrors.phone}>
                    <input type="tel" autoComplete="tel" inputMode="tel" maxLength={LIMITS.phone} {...inputProps('phone')} />
                  </Field>
                </div>
                <Field id="contact-projectType" label="Project type" error={allErrors.projectType}>
                  <select {...inputProps('projectType')} className={`${inputClasses(Boolean(allErrors.projectType))} [color-scheme:dark]`}>
                    <option value="">Select a type</option>
                    {PROJECT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </Field>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field id="contact-budget" label="Budget" error={allErrors.budget}>
                    <select {...inputProps('budget')} className={`${inputClasses(Boolean(allErrors.budget))} [color-scheme:dark]`}>
                      <option value="">Select a range</option>
                      {BUDGETS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </Field>
                  <Field id="contact-timeline" label="Timeline" error={allErrors.timeline}>
                    <select {...inputProps('timeline')} className={`${inputClasses(Boolean(allErrors.timeline))} [color-scheme:dark]`}>
                      <option value="">Select a timeline</option>
                      {TIMELINES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            {serverError && (
              <div
                ref={alertRef}
                tabIndex={-1}
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/15 p-4 text-sm text-red-200"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p>{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} aria-hidden="true" />
                  </>
                )}
              </span>
            </button>

            {recaptchaConfigured && (
              <p className="text-center text-xs leading-relaxed text-gray-400">
                This site is protected by reCAPTCHA and the Google{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                  Terms of Service
                </a>{' '}
                apply.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

const Contact = () => {
  usePageMeta({
    title: 'Contact',
    description: 'Get in touch with Parfait Tedom Tedom for freelance projects, consulting or full-time opportunities.',
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHero
        tag="Get In Touch"
        title="Let's"
        highlight="Connect"
        subtitle="Have a project in mind or just want to chat? I'd love to hear from you. Drop me a message and I'll get back to you as soon as possible."
      />

      <div className="container-custom">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="min-w-0 space-y-6 lg:col-span-2"
          >
            <section className="glass-card p-4 sm:p-6" aria-labelledby="contact-info-title">
              <h2 id="contact-info-title" className="mb-4 px-2 pt-2 font-heading text-xl font-bold text-white sm:px-0 sm:pt-0">Contact Information</h2>
              <ul className="space-y-1">
                {contactInfo.map((item) => {
                  const external = item.href?.startsWith('http')
                  const inner = (
                    <>
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                        aria-hidden="true"
                      >
                        <item.icon size={22} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-gray-400">{item.label}</span>
                        <span className="block break-words text-white transition-colors group-hover:text-primary">
                          {item.label === 'Email' && item.value.includes('@') ? (
                            <>
                              {item.value.split('@')[0]}@<wbr />
                              {item.value.split('@')[1]}
                            </>
                          ) : item.value}
                        </span>
                      </span>
                    </>
                  )
                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-white/5"
                        >
                          {inner}
                          {external && <span className="sr-only"> (opens in a new tab)</span>}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-3">{inner}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="glass-card p-6" aria-label="Availability">
              <p className="mb-3 flex items-center gap-3">
                <span className="relative flex h-3 w-3" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
                </span>
                <span className="font-medium text-green-300">Available for opportunities</span>
              </p>
              <p className="text-sm text-gray-300">
                Currently open for freelance projects, consulting, and full-time positions
                in full-stack development, AI/ML, IoT, robotics, and cloud computing.
              </p>
            </section>

            <section className="glass-card p-6" aria-labelledby="contact-quick-links">
              <h2 id="contact-quick-links" className="mb-4 font-medium text-white">Quick Links</h2>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <a href={RESUME_URL} download className="inline-flex min-h-[44px] items-center rounded-lg bg-white/5 px-4 text-sm text-gray-200 transition-colors hover:bg-white/10 hover:text-primary">
                    Resume<span className="sr-only"> (PDF)</span>
                  </a>
                </li>
                <li>
                  <Link to="/projects" className="inline-flex min-h-[44px] items-center rounded-lg bg-white/5 px-4 text-sm text-gray-200 transition-colors hover:bg-white/10 hover:text-primary">
                    Projects
                  </Link>
                </li>
                {[{ label: 'LinkedIn', href: LINKEDIN.url }, { label: 'GitHub', href: GITHUB.url }].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center rounded-lg bg-white/5 px-4 text-sm text-gray-200 transition-colors hover:bg-white/10 hover:text-primary"
                    >
                      {link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="min-w-0 lg:col-span-3"
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 sm:mt-20"
          aria-labelledby="contact-cta-title"
        >
          <div className="glass-card mx-auto max-w-4xl p-8 text-center md:p-12">
            <div className="mb-6 flex justify-center gap-3 sm:gap-4" aria-hidden="true">
              {[Globe, Bot, Cloud, Zap].map((Icon, i) => (
                <div key={i} className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={24} />
                </div>
              ))}
            </div>
            <h2 id="contact-cta-title" className="mb-4 text-balance font-display text-2xl font-bold text-white md:text-3xl">
              Based in Edmonton, Working Globally
            </h2>
            <p className="mx-auto max-w-2xl text-gray-300">
              Whether you&apos;re in North America, Europe, or anywhere else,
              I&apos;m ready to collaborate on your next innovative project.
              Let&apos;s build something amazing together.
            </p>
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}

export default Contact
