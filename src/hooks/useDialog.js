import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',')

const getFocusable = (node) => Array.from(node.querySelectorAll(FOCUSABLE))
  .filter((el) => el.getAttribute('aria-hidden') !== 'true' && el.getClientRects().length > 0)

// Several overlays can be open at once (menu + chat…): only unlock on the last one.
let lockCount = 0
let saved = null

/** Prevents the page behind an overlay from scrolling. */
export const useBodyScrollLock = (locked) => {
  useEffect(() => {
    if (!locked) return undefined
    const { body, documentElement } = document
    if (lockCount === 0) {
      const scrollbar = window.innerWidth - documentElement.clientWidth
      saved = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
      body.style.overflow = 'hidden'
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
    }
    lockCount += 1
    return () => {
      lockCount -= 1
      if (lockCount === 0 && saved) {
        body.style.overflow = saved.overflow
        body.style.paddingRight = saved.paddingRight
        saved = null
      }
    }
  }, [locked])
}

/**
 * Keyboard behaviour for dialogs and overlays:
 * - moves focus inside on open (`initialFocusRef` or first focusable element),
 * - optionally traps Tab / Shift+Tab inside the container,
 * - calls `onEscape` on Escape,
 * - restores focus to the previously focused element on close, unless focus
 *   already moved elsewhere (e.g. to <main> after a navigation).
 */
export const useDialog = (containerRef, active, { onEscape, initialFocusRef, trap = true } = {}) => {
  const onEscapeRef = useRef(onEscape)
  onEscapeRef.current = onEscape

  useEffect(() => {
    if (!active) return undefined
    const node = containerRef.current
    if (!node) return undefined
    const previouslyFocused = document.activeElement

    const focusInitial = () => {
      const target = initialFocusRef?.current || getFocusable(node)[0] || node
      target.focus({ preventScroll: true })
    }
    // Wait a frame so enter animations have mounted the content.
    const frame = requestAnimationFrame(focusInitial)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (onEscapeRef.current) {
          event.stopPropagation()
          onEscapeRef.current()
        }
        return
      }
      if (!trap || event.key !== 'Tab') return
      const items = getFocusable(node)
      if (items.length === 0) {
        event.preventDefault()
        node.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement
      if (event.shiftKey && (current === first || !node.contains(current))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (current === last || !node.contains(current))) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      const current = document.activeElement
      const focusLost = !current || current === document.body || node.contains(current)
      if (focusLost && previouslyFocused?.focus && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps
}
