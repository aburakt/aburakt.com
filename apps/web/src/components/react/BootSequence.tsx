import { useState, useEffect, useRef } from 'react'

const BOOT_LINES = [
  { tag: 'BIOS', text: 'Initializing system...' },
  { tag: 'OK', text: 'Memory check: 16384 MB' },
  { tag: 'OK', text: 'Loading kernel modules' },
  { tag: 'OK', text: 'Mounting filesystems' },
  { tag: 'OK', text: 'Starting network services' },
  { tag: 'OK', text: 'aburakt.com v2.0 ready' },
]

export default function BootSequence() {
  const [visible, setVisible] = useState(false)
  const [lines, setLines] = useState<number>(0)
  const [showCursor, setShowCursor] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    if (typeof window === 'undefined') return

    const alreadySeen = localStorage.getItem('boot_seen')
    if (alreadySeen) return

    setVisible(true)

    // Show lines one by one
    let lineIndex = 0
    const interval = setInterval(() => {
      lineIndex++
      setLines(lineIndex)
      if (lineIndex >= BOOT_LINES.length) {
        clearInterval(interval)
        // Show cursor prompt
        setTimeout(() => setShowCursor(true), 100)
        // Start fade out
        setTimeout(() => {
          setFadingOut(true)
          localStorage.setItem('boot_seen', '1')
        }, 600)
        // Remove from DOM
        setTimeout(() => setVisible(false), 1200)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"JetBrains Mono", monospace',
        transition: 'opacity 0.6s ease-out',
        opacity: fadingOut ? 0 : 1,
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
        {BOOT_LINES.slice(0, lines).map((line, i) => (
          <div key={i} style={{ marginBottom: '0.35rem', fontSize: '0.875rem' }}>
            <span
              style={{
                color: line.tag === 'BIOS' ? '#f59e0b' : '#4ade80',
                fontWeight: 700,
              }}
            >
              [{line.tag}]
            </span>{' '}
            <span style={{ color: '#4ade80' }}>{line.text}</span>
          </div>
        ))}
        {showCursor && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#4ade80' }}>
            {'> '}
            <span
              style={{
                display: 'inline-block',
                width: '0.5rem',
                height: '1rem',
                backgroundColor: '#4ade80',
                animation: 'boot-blink 1s step-end infinite',
                verticalAlign: 'text-bottom',
              }}
            />
          </div>
        )}
        <style>{`
          @keyframes boot-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  )
}
