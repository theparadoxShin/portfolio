import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero'
import { usePageMeta } from '../hooks/usePageMeta'
import { EMAIL, FULL_NAME, LOCATION } from '../data/profile'

const EFFECTIVE_DATE = { label: 'October 1, 2026', iso: '2026-10-01' }

const linkClass = 'break-words text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary'

const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
    {children}
    <span className="sr-only"> (opens in a new tab)</span>
  </a>
)

const MailLink = () => <a href={`mailto:${EMAIL}`} className={linkClass}>{EMAIL}</a>

const List = ({ children }) => (
  <ul className="list-disc space-y-2 pl-5 marker:text-primary/70">{children}</ul>
)

const Strong = ({ children }) => <strong className="font-semibold text-white">{children}</strong>

const SECTIONS = [
  {
    id: 'who',
    title: 'Who I am',
    body: (
      <>
        <p>
          This site is the personal portfolio of <Strong>{FULL_NAME}</Strong>, based in {LOCATION}.
          It is also used for freelance and consulting inquiries.
        </p>
        <p>
          For any question about this policy or your personal information, write to <MailLink />.
        </p>
      </>
    ),
  },
  {
    id: 'collect',
    title: 'Information I collect',
    body: (
      <>
        <p>When you use the contact form, I collect:</p>
        <List>
          <li>your name, e-mail address, subject and message;</li>
          <li>optionally, your phone number, company, project type, budget and timeline;</li>
          <li>your IP address and browser user-agent, for spam prevention and security.</li>
        </List>
      </>
    ),
  },
  {
    id: 'use',
    title: 'Why I use it',
    body: (
      <p>
        I use this information only to answer your request and to manage the professional
        relationship that may follow. It is never sold or rented, and I do not send marketing
        e-mails without your explicit consent.
      </p>
    ),
  },
  {
    id: 'storage',
    title: 'Where it is stored',
    body: (
      <List>
        <li>The site and its API run on Amazon Web Services (AWS).</li>
        <li>Contact form submissions are stored in a database in AWS&apos;s Canada (Central) region, in Montréal.</li>
        <li>Public site files are delivered through AWS CloudFront&apos;s global network.</li>
        <li>A notification copy of each message is e-mailed to my mailbox at my e-mail hosting provider.</li>
      </List>
    ),
  },
  {
    id: 'helena',
    title: 'Helena chat assistant',
    body: (
      <p>
        Messages you type in the chat are sent to the server only to generate an answer from the
        public content of this portfolio. They are not stored. Please do not share personal
        information in the chat.
      </p>
    ),
  },
  {
    id: 'retention',
    title: 'How long I keep it',
    body: (
      <p>
        Contact form messages are kept as long as needed to handle your request and the professional
        relationship, then deleted. You can ask me to delete them at any time. Technical server
        logs are kept for up to 30 days.
      </p>
    ),
  },
  {
    id: 'third-parties',
    title: 'Third-party services',
    body: (
      <List>
        <li>
          <Strong>Google reCAPTCHA v3</Strong> protects the contact form. It collects hardware and
          software information and sends it to Google. This site is protected by reCAPTCHA and
          the Google <ExternalLink href="https://policies.google.com/privacy">Privacy Policy</ExternalLink>{' '}
          and <ExternalLink href="https://policies.google.com/terms">Terms of Service</ExternalLink> apply.
        </li>
        <li>
          <Strong>Google Fonts</Strong> serves the web fonts, so Google receives your IP address
          when the page loads.
        </li>
        <li>
          <Strong>Amazon Web Services (AWS)</Strong> acts as hosting provider.
        </li>
      </List>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    body: (
      <p>
        This site uses no analytics, advertising or tracking cookies. reCAPTCHA may set cookies
        needed for spam protection.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        The site is served over HTTPS everywhere, stored data is encrypted at rest, and access is
        limited to the site owner.
      </p>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    body: (
      <>
        <p>
          Under Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA)
          and Alberta&apos;s Personal Information Protection Act (PIPA), you can ask to access,
          correct or delete your personal information, and withdraw your consent. Write to{' '}
          <MailLink /> and I will answer within 30 days.
        </p>
        <p>You can also file a complaint with:</p>
        <List>
          <li>
            the <ExternalLink href="https://www.priv.gc.ca">Office of the Privacy Commissioner of Canada</ExternalLink>;
          </li>
          <li>
            the <ExternalLink href="https://oipc.ab.ca">Office of the Information and Privacy Commissioner of Alberta</ExternalLink>.
          </li>
        </List>
      </>
    ),
  },
  {
    id: 'outside-canada',
    title: 'Visitors outside Canada',
    body: (
      <p>
        Your data is stored in Canada. If you live elsewhere, equivalent requests (for example
        under the GDPR) are honoured on request.
      </p>
    ),
  },
  {
    id: 'children',
    title: 'Children',
    body: <p>This site is not directed to children under 16.</p>,
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: <p>Changes are posted on this page with a new effective date.</p>,
  },
]

const Privacy = () => {
  usePageMeta({
    title: 'Privacy Policy',
    description:
      'How parfaittedomtedom.com handles personal information: what the contact form collects, why, where it is stored, how long it is kept and your rights under PIPEDA and Alberta PIPA.',
  })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PageHero
        tag="Your Data"
        title="Privacy"
        highlight="Policy"
        subtitle="How the information you share on this site is collected, used, stored and protected."
      />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14"
        >
          {/* Table of contents (wide screens) */}
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gray-400">On this page</p>
              <ol className="border-l border-white/10">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <Link
                      to={`#${section.id}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-gray-400 transition-colors
                                 hover:border-primary hover:text-primary"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="glass-card min-w-0 max-w-[70ch] p-6 sm:p-10">
            <p className="mb-10 inline-flex flex-wrap items-center gap-x-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono text-sm text-gray-300">
              <span className="text-primary">Effective date:</span>
              <time dateTime={EFFECTIVE_DATE.iso}>{EFFECTIVE_DATE.label}</time>
            </p>

            <div className="space-y-10 text-base leading-relaxed text-gray-300 sm:text-[1.0625rem]">
              {SECTIONS.map((section) => (
                <section key={section.id} aria-labelledby={section.id} className="space-y-4">
                  <h2 id={section.id} className="font-heading text-xl font-semibold text-white sm:text-2xl">
                    {section.title}
                  </h2>
                  {section.body}
                </section>
              ))}
            </div>
          </article>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Privacy
