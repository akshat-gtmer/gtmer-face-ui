import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, trackButtonClick } from '../../utils/telemetry'

export const TelemetryTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const lastPathRef = useRef<string>('')

  // 1. Trace Pageviews on initial mount & on every React Router location change
  useEffect(() => {
    const currentPath = location.pathname + location.search
    if (location.pathname.startsWith('/admin')) return

    if (currentPath !== lastPathRef.current) {
      lastPathRef.current = currentPath
      // Short timeout to allow document.title to update
      const timer = setTimeout(() => {
        trackPageView(currentPath, document.title)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [location])

  // 2. Global Delegated Click Listener to capture button & CTA clicks across every page
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (window.location.pathname.startsWith('/admin')) return

      const target = event.target as HTMLElement | null
      if (!target) return


      // Find closest clickable element (button, anchor link, submit input, role="button", or element with button classes)
      const clickable = target.closest(
        'button, a, input[type="submit"], input[type="button"], [role="button"], [data-track-id], [data-track-name], [aria-label], [class*="Btn"], [class*="btn"], [class*="button"], [class*="Button"]'
      ) as HTMLElement | null

      if (!clickable) return

      // Extract and clean button text or identifier
      let rawText =
        clickable.getAttribute('data-track-name') ||
        clickable.getAttribute('aria-label') ||
        (clickable as HTMLInputElement).value ||
        clickable.innerText ||
        clickable.textContent ||
        clickable.getAttribute('title') ||
        clickable.getAttribute('name') ||
        clickable.id ||
        clickable.tagName ||
        ''

      // Clean up whitespace & linebreaks
      const buttonText = rawText.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 80)

      if (!buttonText) return

      const buttonId = clickable.id || clickable.getAttribute('data-track-id') || undefined
      const targetUrl = (clickable as HTMLAnchorElement).href || undefined
      const currentPath = window.location.pathname + window.location.search

      trackButtonClick(buttonText, buttonId, currentPath, targetUrl)
    }

    window.addEventListener('click', handleGlobalClick, { capture: true })
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true })
    }
  }, [])

  return <>{children}</>
}


export default TelemetryTracker
