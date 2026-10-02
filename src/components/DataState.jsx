import { AlertTriangle, RefreshCw } from 'lucide-react'

/** Lightweight fallback while a lazily-loaded page chunk downloads. */
export const PageLoader = () => (
  <div className="flex min-h-[70vh] items-center justify-center pt-20" role="status">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/25 border-t-primary" aria-hidden="true" />
    <span className="sr-only">Loading page…</span>
  </div>
)

/** Placeholder cards with the same footprint as the real ones (no layout jump). */
export const CardSkeletonGrid = ({
  count = 3,
  label = 'Loading…',
  className = 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8',
  cardClassName = 'h-80',
  withMedia = false,
}) => (
  <div role="status" aria-live="polite">
    <span className="sr-only">{label}</span>
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`glass-card relative overflow-hidden p-6 ${cardClassName}`}>
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="relative space-y-4">
            {withMedia ? <div className="h-44 rounded-lg bg-white/5" /> : <div className="h-12 w-12 rounded-xl bg-primary/10" />}
            <div className="h-5 w-2/3 rounded bg-white/10" />
            <div className="h-3.5 w-full rounded bg-white/5" />
            <div className="h-3.5 w-5/6 rounded bg-white/5" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 rounded-full bg-primary/10" />
              <div className="h-6 w-14 rounded-full bg-primary/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

/** Error message from the API with an optional retry button. */
export const ErrorState = ({ title = 'Unable to load content', message, onRetry, compact = false }) => (
  <div
    role="alert"
    className={`glass-card mx-auto max-w-xl border-red-400/30 text-center ${compact ? 'p-6' : 'p-8'}`}
  >
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
      <AlertTriangle className="h-6 w-6 text-red-300" aria-hidden="true" />
    </div>
    <h2 className="mb-2 font-heading text-lg font-semibold text-white">{title}</h2>
    {message && <p className="mb-6 text-sm text-gray-300">{message}</p>}
    {onRetry && (
      <button type="button" onClick={onRetry} className="btn-outline min-h-[44px] gap-2 px-6 py-2.5 text-sm">
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </button>
    )}
  </div>
)

/** Friendly "nothing here yet" block. */
export const EmptyState = ({ icon: Icon, title, children, headingLevel = 'h2' }) => {
  const Heading = headingLevel
  return (
    <div className="py-16 text-center">
      {Icon && (
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>
      )}
      <Heading className="mb-3 font-heading text-2xl font-semibold text-white">{title}</Heading>
      {children && <div className="mx-auto max-w-lg text-gray-300">{children}</div>}
    </div>
  )
}
