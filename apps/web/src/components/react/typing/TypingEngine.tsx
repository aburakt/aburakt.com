import { useState, useEffect, useCallback, useRef } from 'react'
import Keyboard from './Keyboard'
import { findKey, type Layout } from './keyboardLayouts'

interface Props {
  text: string
  layout: Layout
  onComplete?: (stats: TypingStats) => void
  showKeyboard?: boolean
  showStats?: boolean
}

export interface TypingStats {
  wpm: number
  accuracy: number
  time: number
  correct: number
  incorrect: number
  total: number
}

export default function TypingEngine({ text, layout, onComplete, showKeyboard = true, showStats = true }: Props) {
  const [typed, setTyped] = useState('')
  const [errors, setErrors] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const pos = typed.length
  const isComplete = pos >= text.length && endTime !== null
  const currentChar = pos < text.length ? text[pos] : undefined
  const keyDef = currentChar ? findKey(layout, currentChar) : undefined

  const getStats = useCallback((): TypingStats => {
    const elapsed = ((endTime ?? Date.now()) - (startTime ?? Date.now())) / 1000
    const words = typed.length / 5
    const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0
    const correct = typed.split('').filter((c, i) => c === text[i]).length
    return {
      wpm,
      accuracy: typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100,
      time: Math.round(elapsed * 10) / 10,
      correct,
      incorrect: errors,
      total: typed.length,
    }
  }, [typed, text, startTime, endTime, errors])

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete(getStats())
    }
  }, [isComplete, onComplete, getStats])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape' || e.ctrlKey || e.altKey || e.metaKey) return
    if (isComplete) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      setTyped((t) => t.slice(0, -1))
      return
    }

    if (e.key.length !== 1) return
    e.preventDefault()

    if (!startTime) setStartTime(Date.now())

    const expected = text[pos]
    if (e.key !== expected) {
      setErrors((err) => err + 1)
    }

    const next = typed + e.key
    setTyped(next)

    if (next.length >= text.length) {
      setEndTime(Date.now())
    }
  }

  const stats = getStats()

  // Calculate live WPM
  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0
  const liveWpm = elapsed > 1 ? Math.round(((typed.length / 5) / elapsed) * 60) : 0

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="outline-none"
    >
      {showStats && startTime && !isComplete && (
        <div className="mb-4 flex gap-6 text-xs text-zinc-500">
          <span>WPM: <span className="font-mono text-zinc-300">{liveWpm}</span></span>
          <span>Errors: <span className="font-mono text-red-400">{errors}</span></span>
          <span>Progress: <span className="font-mono text-zinc-300">{Math.round((pos / text.length) * 100)}%</span></span>
        </div>
      )}

      <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6 font-mono text-lg leading-relaxed tracking-wide">
        {text.split('').map((char, i) => {
          let cls = 'text-zinc-600'
          if (i < pos) {
            cls = typed[i] === char ? 'text-green-400' : 'text-red-400 underline'
          } else if (i === pos) {
            cls = 'bg-primary-500/30 text-zinc-100 border-b-2 border-primary-400'
          }
          return (
            <span key={i} className={cls}>
              {char === ' ' && i === pos ? '\u00A0' : char}
            </span>
          )
        })}
      </div>

      {isComplete && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-primary-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-primary-400">{stats.wpm}</p>
            <p className="text-xs text-zinc-500">WPM</p>
          </div>
          <div className="rounded-lg bg-green-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.accuracy}%</p>
            <p className="text-xs text-zinc-500">Accuracy</p>
          </div>
          <div className="rounded-lg bg-blue-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.time}s</p>
            <p className="text-xs text-zinc-500">Time</p>
          </div>
          <div className="rounded-lg bg-red-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{stats.incorrect}</p>
            <p className="text-xs text-zinc-500">Errors</p>
          </div>
        </div>
      )}

      {showKeyboard && !isComplete && (
        <div className="mt-6">
          <Keyboard
            layout={layout}
            activeKey={currentChar}
            activeFinger={keyDef?.finger}
          />
        </div>
      )}
    </div>
  )
}
