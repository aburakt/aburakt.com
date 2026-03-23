import { useState, useEffect, useRef, useCallback } from 'react'
import Keyboard from './Keyboard'
import { findKey, type Layout } from './keyboardLayouts'

interface Props {
  locale: string
}

const enWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'code', 'type', 'fast',
]

const trWords = [
  'bir', 'bu', 'ne', 've', 'ile', 'da', 'de', 'ben', 'sen', 'biz',
  'var', 'yok', 'her', 'çok', 'iyi', 'son', 'gün', 'olan', 'için',
  'daha', 'ama', 'hem', 'tam', 'yeni', 'eski', 'gibi', 'kadar', 'sonra',
  'önce', 'şimdi', 'zaman', 'gece', 'sabah', 'akşam', 'hafta', 'saat',
  'olmak', 'yapmak', 'gelmek', 'gitmek', 'bilmek', 'istemek', 'görmek',
  'vermek', 'almak', 'demek', 'bulmak', 'durmak', 'oturmak', 'kalkmak',
  'okumak', 'yazmak', 'düşünmek', 'konuşmak', 'anlamak', 'başlamak',
  'güzel', 'büyük', 'küçük', 'uzun', 'kısa', 'hızlı', 'yavaş',
  'kolay', 'doğru', 'yanlış', 'evet', 'hayır', 'belki', 'lütfen',
  'kod', 'hız', 'test', 'sayfa', 'tuş', 'ekran', 'program', 'yazılım',
]

function generateWords(pool: string[], count: number): string {
  const words: string[] = []
  for (let i = 0; i < count; i++) {
    words.push(pool[Math.floor(Math.random() * pool.length)])
  }
  return words.join(' ')
}

export default function SpeedChallenge({ locale }: Props) {
  const tr = locale === 'tr'
  const layout: Layout = tr ? 'tr' : 'en'
  const pool = tr ? trWords : enWords

  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  const [text, setText] = useState('')
  const [typed, setTyped] = useState('')
  const [errors, setErrors] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [wpmHistory, setWpmHistory] = useState<number[]>([])
  const [bestWpm, setBestWpm] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const pos = typed.length
  const currentChar = pos < text.length ? text[pos] : undefined
  const keyDef = currentChar ? findKey(layout, currentChar) : undefined

  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0
  const liveWpm = elapsed > 1 ? Math.round(((typed.length / 5) / elapsed) * 60) : 0

  const finish = useCallback(() => {
    setState('done')
    if (intervalRef.current) clearInterval(intervalRef.current)
    const finalWpm = liveWpm
    if (finalWpm > bestWpm) setBestWpm(finalWpm)
  }, [liveWpm, bestWpm])

  useEffect(() => {
    if (state === 'playing') {
      intervalRef.current = setInterval(() => {
        setWpmHistory((h) => [...h, liveWpm])
      }, 1000)
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
  }, [state, liveWpm])

  useEffect(() => {
    if (pos >= text.length && text.length > 0 && state === 'playing') {
      finish()
    }
  }, [pos, text.length, state, finish])

  function startGame() {
    const t = generateWords(pool, 40)
    setText(t)
    setTyped('')
    setErrors(0)
    setStartTime(0)
    setWpmHistory([])
    setState('playing')
    setTimeout(() => containerRef.current?.focus(), 50)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (state !== 'playing') return
    if (e.ctrlKey || e.altKey || e.metaKey) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      setTyped((t) => t.slice(0, -1))
      return
    }

    if (e.key.length !== 1) return
    e.preventDefault()

    if (!startTime) setStartTime(Date.now())

    if (e.key !== text[pos]) {
      setErrors((err) => err + 1)
    }
    setTyped((t) => t + e.key)
  }

  const accuracy = typed.length > 0
    ? Math.round((typed.split('').filter((c, i) => c === text[i]).length / typed.length) * 100)
    : 100

  // Simple ASCII WPM sparkline
  const maxWpm = Math.max(...wpmHistory, 1)
  const sparkBars = '▁▂▃▄▅▆▇█'

  return (
    <div className="space-y-6">
      {state === 'idle' && (
        <div className="text-center">
          <p className="mb-4 text-sm text-zinc-400">
            {tr
              ? 'Rastgele kelimelerle hız yarışı. En yüksek WPM skorunuzu kırın!'
              : 'Race through random words. Beat your best WPM score!'}
          </p>
          {bestWpm > 0 && (
            <p className="mb-4 text-sm text-zinc-500">
              {tr ? 'En iyi' : 'Best'}: <span className="font-mono text-primary-400">{bestWpm} WPM</span>
            </p>
          )}
          <button
            onClick={startGame}
            className="rounded-lg bg-primary-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-primary-500"
          >
            {tr ? 'Başla' : 'Start'}
          </button>
        </div>
      )}

      {state === 'playing' && (
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="outline-none"
        >
          <div className="mb-4 flex items-center justify-between text-xs text-zinc-500">
            <span className="text-lg font-bold text-primary-400">{liveWpm} <span className="text-xs font-normal">WPM</span></span>
            <span>{accuracy}% {tr ? 'doğruluk' : 'accuracy'}</span>
            <span>{errors} {tr ? 'hata' : 'errors'}</span>
          </div>

          <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-6 font-mono text-lg leading-relaxed tracking-wide">
            {text.split('').map((char, i) => {
              let cls = 'text-zinc-600'
              if (i < pos) {
                cls = typed[i] === char ? 'text-green-400' : 'text-red-400 underline'
              } else if (i === pos) {
                cls = 'bg-primary-500/30 text-zinc-100 border-b-2 border-primary-400'
              }
              return <span key={i} className={cls}>{char === ' ' && i === pos ? '\u00A0' : char}</span>
            })}
          </div>

          {wpmHistory.length > 5 && (
            <div className="mt-3 font-mono text-xs text-zinc-600">
              {wpmHistory.slice(-30).map((w) => {
                const idx = Math.min(Math.floor((w / maxWpm) * (sparkBars.length - 1)), sparkBars.length - 1)
                return sparkBars[idx]
              }).join('')}
            </div>
          )}

          <div className="mt-4">
            <Keyboard layout={layout} activeKey={currentChar} activeFinger={keyDef?.finger} />
          </div>
        </div>
      )}

      {state === 'done' && (
        <div className="space-y-6 text-center">
          <div className="rounded-xl bg-zinc-800/50 p-8">
            <p className="text-5xl font-bold text-primary-400">{liveWpm}</p>
            <p className="mt-1 text-sm text-zinc-500">WPM</p>
            <div className="mt-6 flex justify-center gap-8">
              <div>
                <p className="text-2xl font-semibold text-green-400">{accuracy}%</p>
                <p className="text-xs text-zinc-500">{tr ? 'Doğruluk' : 'Accuracy'}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-red-400">{errors}</p>
                <p className="text-xs text-zinc-500">{tr ? 'Hata' : 'Errors'}</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-yellow-400">{bestWpm}</p>
                <p className="text-xs text-zinc-500">{tr ? 'En İyi' : 'Best'}</p>
              </div>
            </div>
          </div>

          {wpmHistory.length > 2 && (
            <div className="rounded-lg bg-zinc-800/30 p-4">
              <p className="mb-2 text-xs text-zinc-500">{tr ? 'WPM Grafiği' : 'WPM Graph'}</p>
              <div className="flex h-16 items-end gap-px">
                {wpmHistory.map((w, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary-500/60"
                    style={{ height: `${Math.max((w / Math.max(...wpmHistory, 1)) * 100, 4)}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={startGame}
            className="rounded-lg bg-primary-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-primary-500"
          >
            {tr ? 'Tekrar Dene' : 'Try Again'}
          </button>
        </div>
      )}
    </div>
  )
}
