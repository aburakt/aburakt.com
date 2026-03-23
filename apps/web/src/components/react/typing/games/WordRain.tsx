import { useState, useEffect, useRef, useCallback } from 'react'
import { saveTypingStat } from '../../useAuth'

interface Props {
  locale: string
}

interface FallingWord {
  id: number
  word: string
  x: number
  y: number
  speed: number
}

const enWords = [
  'code', 'type', 'fast', 'key', 'word', 'rain', 'game', 'test', 'run', 'bug',
  'fix', 'dev', 'app', 'web', 'api', 'log', 'git', 'npm', 'css', 'dom',
  'map', 'set', 'get', 'put', 'end', 'new', 'old', 'big', 'red', 'top',
  'node', 'loop', 'func', 'data', 'file', 'path', 'port', 'host', 'link',
  'push', 'pull', 'fork', 'diff', 'hash', 'sort', 'trim', 'join', 'find',
  'react', 'state', 'props', 'async', 'await', 'fetch', 'parse', 'merge',
  'build', 'clean', 'watch', 'start', 'debug', 'stack', 'queue', 'array',
]

const trWords = [
  'kod', 'hız', 'tuş', 'yaz', 'oku', 'sil', 'bul', 'çiz', 'aç', 'kur',
  'web', 'uç', 'alt', 'üst', 'son', 'baş', 'tam', 'boş', 'dol', 'dur',
  'git', 'gel', 'ver', 'al', 'de', 'yap', 'bak', 'bil', 'gör', 'sat',
  'dosya', 'veri', 'sayfa', 'ekran', 'satır', 'dizin', 'hücre',
  'yazı', 'alan', 'renk', 'boyut', 'değer', 'girdi', 'çıktı',
  'başla', 'bitir', 'kaydet', 'temiz', 'hızlı', 'kolay', 'doğru',
]

export default function WordRain({ locale }: Props) {
  const tr = locale === 'tr'
  const pool = tr ? trWords : enWords

  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  const [words, setWords] = useState<FallingWord[]>([])
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [missed, setMissed] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [level, setLevel] = useState(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const frameRef = useRef<number>()
  const lastSpawnRef = useRef(0)
  const idRef = useRef(0)
  const startTimeRef = useRef(0)
  const maxMissed = 5

  const spawnWord = useCallback(() => {
    const word = pool[Math.floor(Math.random() * pool.length)]
    const newWord: FallingWord = {
      id: idRef.current++,
      word,
      x: Math.random() * 80 + 10,
      y: 0,
      speed: 0.3 + level * 0.1 + Math.random() * 0.2,
    }
    setWords((prev) => [...prev, newWord])
  }, [pool, level])

  const gameLoop = useCallback(() => {
    const now = Date.now()

    // Spawn new words
    const spawnInterval = Math.max(2000 - level * 200, 800)
    if (now - lastSpawnRef.current > spawnInterval) {
      spawnWord()
      lastSpawnRef.current = now
    }

    // Move words down
    setWords((prev) => {
      const updated = prev.map((w) => ({ ...w, y: w.y + w.speed }))
      const fallen = updated.filter((w) => w.y >= 100)
      if (fallen.length > 0) {
        setMissed((m) => {
          const newMissed = m + fallen.length
          if (newMissed >= maxMissed) {
            setState('done')
          }
          return newMissed
        })
        setCombo(0)
      }
      return updated.filter((w) => w.y < 100)
    })

    frameRef.current = requestAnimationFrame(gameLoop)
  }, [spawnWord, level])

  useEffect(() => {
    if (state === 'playing') {
      lastSpawnRef.current = Date.now()
      frameRef.current = requestAnimationFrame(gameLoop)
      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current)
      }
    }
  }, [state, gameLoop])

  useEffect(() => {
    // Level up every 10 points
    setLevel(Math.floor(score / 10) + 1)
  }, [score])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setInput(val)

    // Check if typed word matches any falling word
    const match = words.find((w) => w.word === val.trim().toLowerCase())
    if (match) {
      setWords((prev) => prev.filter((w) => w.id !== match.id))
      setScore((s) => s + 1)
      setCombo((c) => {
        const next = c + 1
        setMaxCombo((m) => Math.max(m, next))
        return next
      })
      setInput('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setState('done')
    }
  }

  // Save stat when game ends
  useEffect(() => {
    if (state === 'done') {
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
      saveTypingStat({ mode: 'game', wpm: score, accuracy: 100, duration_s: elapsed, layout: 'en' })
    }
  }, [state, score])

  function startGame() {
    setState('playing')
    setWords([])
    setInput('')
    setScore(0)
    setMissed(0)
    setCombo(0)
    setMaxCombo(0)
    setLevel(1)
    idRef.current = 0
    startTimeRef.current = Date.now()
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
      <h3 className="text-lg font-semibold text-green-400">🌧️ Word Rain</h3>
      <p className="mt-1 text-sm text-green-600">
        {tr
          ? 'Düşen kelimeleri yere ulaşmadan önce yazın. 5 kelime kaçırırsanız oyun biter.'
          : 'Type falling words before they hit the ground. Miss 5 and the game is over.'}
      </p>

      {state === 'idle' && (
        <button
          onClick={startGame}
          className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
        >
          {tr ? 'Başla' : 'Start'}
        </button>
      )}

      {state === 'playing' && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-green-700">
            <span>{tr ? 'Skor' : 'Score'}: <span className="text-green-400">{score}</span></span>
            <span>{tr ? 'Kombo' : 'Combo'}: <span className="text-amber-400">{combo}</span></span>
            <span>{tr ? 'Seviye' : 'Level'}: {level}</span>
            <span className="text-red-400">{'❤'.repeat(maxMissed - missed)}{'🖤'.repeat(missed)}</span>
          </div>

          <div className="relative h-64 overflow-hidden rounded-lg border border-green-900/30 bg-black">
            {words.map((w) => (
              <div
                key={w.id}
                className="absolute font-mono text-sm font-medium text-green-400 transition-none"
                style={{
                  left: `${w.x}%`,
                  top: `${w.y}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {w.word.split('').map((char, i) => {
                  const isTyped = input.length > 0 && w.word.startsWith(input.toLowerCase()) && i < input.length
                  return (
                    <span key={i} className={isTyped ? 'text-green-300' : ''}>
                      {char}
                    </span>
                  )
                })}
              </div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-red-500/50" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-green-900/30 bg-black px-4 py-2 font-mono text-green-400 outline-none focus:border-green-500"
            placeholder={tr ? 'Kelimeyi yazın...' : 'Type the word...'}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      )}

      {state === 'done' && (
        <div className="mt-4 space-y-4 text-center">
          <div className="rounded-lg bg-green-500/10 p-4">
            <p className="text-lg font-semibold text-green-400">
              {tr ? 'Skor' : 'Score'}: {score}
            </p>
            <p className="mt-1 text-sm text-green-700">
              {tr ? 'En yüksek kombo' : 'Max combo'}: {maxCombo} · {tr ? 'Seviye' : 'Level'}: {level}
            </p>
          </div>
          <button
            onClick={startGame}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
          >
            {tr ? 'Tekrar Oyna' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  )
}
