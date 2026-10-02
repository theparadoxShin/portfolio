import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const scrollToTop = () => {
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  } catch {
    window.scrollTo(0, 0)
  }
}

/**
 * - Scrolls to the top on every navigation (or to a `#hash` target, waiting
 *   for content that renders after an API call).
 * - Moves focus to <main> after client-side navigation so keyboard and
 *   screen-reader users start at the new page content.
 */
const ScrollManager = () => {
  const { pathname, hash, key } = useLocation()
  // Compare with the previous path (not a "first render" flag, which StrictMode's
  // double-invoked effects would flip and then steal focus on the initial load).
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (!hash) {
      scrollToTop()
      return undefined
    }
    let attempts = 0
    let timer
    const scrollToHash = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
      if (attempts++ < 40) timer = setTimeout(scrollToHash, 100)
    }
    scrollToHash()
    return () => clearTimeout(timer)
  }, [pathname, hash, key])

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    if (hash) return
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}

export default ScrollManager
