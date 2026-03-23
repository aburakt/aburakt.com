import { useState, useEffect, useCallback, useRef } from 'react'

type VimMode = 'normal' | 'insert'

interface Props {
  locale: string
}

export default function VimNavigation({ locale }: Props) {
  const [mode, setMode] = useState<VimMode>('normal')
  const [enabled, setEnabled] = useState(true)
  const [showIndicator, setShowIndicator] = useState(true)
  const keyBuffer = useRef('')
  const keyTimeout = useRef<ReturnType<typeof setTimeout>>()
  const leaderActive = useRef(false)
  const leaderTimeout = useRef<ReturnType<typeof setTimeout>>()

  // Load preferences
  useEffect(() => {
    const pref = localStorage.getItem('vim-nav-enabled')
    if (pref === 'false') {
      setEnabled(false)
      setShowIndicator(false)
    }
  }, [])

  // Track focus for insert mode
  useEffect(() => {
    function onFocus(e: FocusEvent) {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        setMode('insert')
      }
    }

    function onBlur() {
      setMode('normal')
    }

    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', onBlur)
    return () => {
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('focusout', onBlur)
    }
  }, [])

  const getSections = useCallback(() => {
    return Array.from(document.querySelectorAll('[data-section]')) as HTMLElement[]
  }, [])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return
      if (mode === 'insert') return

      // Don't interfere with modifier keys
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const key = e.key

      // Space-leader system
      if (key === ' ') {
        e.preventDefault()
        if (leaderActive.current) {
          // Space Space = open command palette
          document.dispatchEvent(new CustomEvent('vim:search'))
          document.dispatchEvent(new CustomEvent('vim:leader-dismiss'))
          leaderActive.current = false
          clearTimeout(leaderTimeout.current)
          return
        }
        leaderActive.current = true
        document.dispatchEvent(new CustomEvent('vim:leader'))
        leaderTimeout.current = setTimeout(() => {
          leaderActive.current = false
          document.dispatchEvent(new CustomEvent('vim:leader-dismiss'))
        }, 800)
        return
      }

      if (leaderActive.current) {
        e.preventDefault()
        leaderActive.current = false
        clearTimeout(leaderTimeout.current)
        document.dispatchEvent(new CustomEvent('vim:leader-dismiss'))

        const prefix = locale === 'en' ? '/en' : ''
        const leaderMap: Record<string, () => void> = {
          v: () => { window.location.href = `${prefix}/lab/vim` },
          t: () => { window.location.href = `${prefix}/lab/typing` },
          s: () => { document.dispatchEvent(new CustomEvent('vim:search')) },
          g: () => { window.open('https://github.com/aburakt', '_blank') },
          l: () => { window.location.href = locale === 'en' ? '/' : '/en/' },
          '?': () => { document.dispatchEvent(new CustomEvent('vim:cheatsheet')) },
        }

        const action = leaderMap[key]
        if (action) action()
        return
      }

      // Handle search modal trigger
      if (key === '/') {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('vim:search'))
        return
      }

      if (key === ':') {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('vim:search'))
        return
      }

      // Handle cheatsheet trigger
      if (key === '?') {
        e.preventDefault()
        document.dispatchEvent(new CustomEvent('vim:cheatsheet'))
        return
      }

      // Single-key actions
      if (key === 'j') {
        e.preventDefault()
        window.scrollBy({ top: 100, behavior: 'smooth' })
        return
      }
      if (key === 'k') {
        e.preventDefault()
        window.scrollBy({ top: -100, behavior: 'smooth' })
        return
      }
      if (key === 'G') {
        e.preventDefault()
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        return
      }
      if (key === 'H') {
        e.preventDefault()
        const sections = getSections()
        const first = sections.find(
          (s) => s.getBoundingClientRect().top >= 0
        )
        first?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (key === 'M') {
        e.preventDefault()
        const sections = getSections()
        const mid = sections[Math.floor(sections.length / 2)]
        mid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      if (key === 'L') {
        e.preventDefault()
        const sections = getSections()
        const last = sections[sections.length - 1]
        last?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        return
      }

      // Multi-key sequences
      clearTimeout(keyTimeout.current)
      keyBuffer.current += key
      keyTimeout.current = setTimeout(() => {
        keyBuffer.current = ''
      }, 500)

      const buf = keyBuffer.current

      if (buf === 'gg') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        keyBuffer.current = ''
        return
      }
      if (buf === 'gi') {
        e.preventDefault()
        window.open('https://github.com/aburakt', '_blank')
        keyBuffer.current = ''
        return
      }
      if (buf === 'gc') {
        e.preventDefault()
        const cvPath = locale === 'en' ? '/en/cv' : '/cv'
        window.location.href = cvPath
        keyBuffer.current = ''
        return
      }
      if (buf === 'gp') {
        e.preventDefault()
        const labPath = locale === 'en' ? '/en/lab' : '/lab'
        window.location.href = labPath
        keyBuffer.current = ''
        return
      }
      if (buf === 'gl') {
        e.preventDefault()
        window.location.href = locale === 'en' ? '/' : '/en/'
        keyBuffer.current = ''
        return
      }
    },
    [enabled, mode, locale, getSections]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  function toggleVimNav() {
    const next = !enabled
    setEnabled(next)
    setShowIndicator(next)
    localStorage.setItem('vim-nav-enabled', String(next))
  }

  if (!showIndicator) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 no-print">
      <button
        onClick={toggleVimNav}
        className="rounded bg-green-950/30 px-2 py-1 font-mono text-xs text-green-400 shadow-lg backdrop-blur transition hover:bg-green-900/30 dark:bg-green-950/30 dark:text-green-400"
        title={enabled ? 'Disable vim navigation' : 'Enable vim navigation'}
      >
        {enabled
          ? mode === 'normal'
            ? '-- NORMAL --'
            : '-- INSERT --'
          : '-- OFF --'}
      </button>
    </div>
  )
}
