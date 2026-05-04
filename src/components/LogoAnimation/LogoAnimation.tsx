import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './LogoAnimation.module.css'

interface TerminalLine {
  type: 'command' | 'output'
  prompt?: string
  text: string
  className?: string
}

const TERMINAL_SEQUENCE: TerminalLine[] = [
  {
    type: 'command',
    prompt: '~',
    text: 'gtmer init --mode autonomous',
  },
  {
    type: 'output',
    text: '◆ system initialized. agents standing by.',
    className: 'success',
  },
  {
    type: 'command',
    prompt: '~',
    text: 'gtmer scan --intent "series-b fintech CTOs"',
  },
  {
    type: 'output',
    text: '→ 847 leads enriched. 12 signals detected.',
    className: 'highlight',
  },
  {
    type: 'command',
    prompt: '~',
    text: 'gtmer engage --personalize --auto-followup',
  },
  {
    type: 'output',
    text: '◆ outreach deployed. agents executing.',
    className: 'success',
  },
]

const LogoAnimation = () => {
  const [completedLines, setCompletedLines] = useState<number>(0)
  const [typedChars, setTypedChars] = useState<number>(0)
  const [phase, setPhase] = useState<'typing' | 'output-pause' | 'done' | 'reset-pause'>('typing')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentLine = TERMINAL_SEQUENCE[completedLines] as TerminalLine | undefined

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const advanceToNextLine = useCallback(() => {
    const nextIndex = completedLines + 1
    if (nextIndex >= TERMINAL_SEQUENCE.length) {
      setPhase('done')
      setCompletedLines(nextIndex)
      // Reset after pause
      timerRef.current = setTimeout(() => {
        setCompletedLines(0)
        setTypedChars(0)
        setPhase('typing')
      }, 4000)
    } else {
      setCompletedLines(nextIndex)
      setTypedChars(0)
      const nextLine = TERMINAL_SEQUENCE[nextIndex]
      if (nextLine.type === 'output') {
        setPhase('output-pause')
        timerRef.current = setTimeout(() => {
          advanceAfterOutput(nextIndex)
        }, 600)
      } else {
        setPhase('typing')
      }
    }
  }, [completedLines])

  const advanceAfterOutput = useCallback((currentIndex: number) => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= TERMINAL_SEQUENCE.length) {
      setPhase('done')
      setCompletedLines(nextIndex)
      timerRef.current = setTimeout(() => {
        setCompletedLines(0)
        setTypedChars(0)
        setPhase('typing')
      }, 4000)
    } else {
      setCompletedLines(nextIndex)
      setTypedChars(0)
      const nextLine = TERMINAL_SEQUENCE[nextIndex]
      if (nextLine.type === 'output') {
        setPhase('output-pause')
        timerRef.current = setTimeout(() => {
          advanceAfterOutput(nextIndex)
        }, 600)
      } else {
        setPhase('typing')
      }
    }
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (phase !== 'typing' || !currentLine || currentLine.type !== 'command') return

    const fullText = currentLine.text
    if (typedChars >= fullText.length) {
      // Pause after finishing command before showing output
      timerRef.current = setTimeout(() => {
        advanceToNextLine()
      }, 400)
      return
    }

    // Variable speed for realism
    const baseSpeed = 32
    const variance = Math.random() * 35
    timerRef.current = setTimeout(() => {
      setTypedChars(prev => prev + 1)
    }, baseSpeed + variance)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, typedChars, currentLine, advanceToNextLine])

  // Initial pause when animation starts on a command
  useEffect(() => {
    if (completedLines === 0 && phase === 'typing' && typedChars === 0) {
      // Small initial delay
      timerRef.current = setTimeout(() => {
        setTypedChars(0) // trigger the typewriter
      }, 500)
    }
  }, [completedLines, phase])

  const renderLines = () => {
    const elements: React.ReactElement[] = []

    for (let i = 0; i < TERMINAL_SEQUENCE.length; i++) {
      const line = TERMINAL_SEQUENCE[i]

      if (i > completedLines) break

      if (line.type === 'command') {
        const isCurrentlyTyping = i === completedLines && phase === 'typing'
        const displayText = isCurrentlyTyping
          ? line.text.slice(0, typedChars)
          : i < completedLines
            ? line.text
            : ''

        if (i < completedLines || isCurrentlyTyping) {
          elements.push(
            <div key={`cmd-${i}`} className={styles.line}>
              <span className={styles.prompt}>{line.prompt} $</span>
              <span className={styles.command}>
                {displayText}
                {isCurrentlyTyping && <span className={styles.cursor} />}
              </span>
            </div>
          )
        }
      } else {
        // Output line — only show if we've moved past it
        if (i < completedLines) {
          elements.push(
            <div
              key={`out-${i}`}
              className={`${styles.output} ${line.className ? styles[line.className as keyof typeof styles] : ''}`}
            >
              {line.text}
            </div>
          )
        }
      }
    }

    // Final blinking cursor when sequence complete
    if (phase === 'done') {
      elements.push(
        <div key="final" className={styles.line}>
          <span className={styles.prompt}>~ $</span>
          <span className={styles.command}>
            <span className={styles.cursor} />
          </span>
        </div>
      )
    }

    return elements
  }

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.blueprintFrame}>
        <div className={styles.cornerMarker} />
        <div className={styles.cornerMarker} />
        <div className={styles.cornerMarker} />
        <div className={styles.cornerMarker} />

        <div className={styles.terminalHeader}>
          <div className={styles.terminalDot} />
          <div className={styles.terminalDot} />
          <div className={styles.terminalDot} />
          <span className={styles.terminalTitle}>gtmer-agent-v1.0</span>
        </div>

        <div className={styles.terminalBody}>
          {renderLines()}
        </div>

        <div className={styles.statusBar}>
          <div className={styles.statusDot} />
          <span className={styles.statusText}>agents active — autonomous mode</span>
        </div>
      </div>
    </div>
  )
}

export default LogoAnimation
