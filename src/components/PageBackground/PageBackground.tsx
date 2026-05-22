import { useState, useEffect } from 'react'
import styles from './PageBackground.module.css'

/* Time-of-day images — transition as user scrolls through the page */
const BG_IMAGES = [
  '/hero/noon.png',      // 12 PM — bright blue sky (top of page)
  '/hero/sunset.png',    // 6 PM — warm golden
  '/hero/predawn.png',   // 9 PM — moonlit purple
  '/hero/midnight.png',  // 12 AM — dark night
  '/hero/dawn.png',      // 6 AM — soft pastel (bottom of page = new day)
]

const PageBackground = () => {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return

      const progress = Math.min(scrollTop / docHeight, 1)
      const index = Math.min(
        Math.floor(progress * BG_IMAGES.length),
        BG_IMAGES.length - 1
      )
      setActiveImage(index)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // set initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Preload all images */
  useEffect(() => {
    BG_IMAGES.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return (
    <div className={styles.wrapper} aria-hidden="true">
      {BG_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`${styles.bgImage} ${i === activeImage ? styles.bgImageActive : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
      {/* Persistent scrim for text readability across all sections */}
      <div className={styles.scrim} />
    </div>
  )
}

export default PageBackground
